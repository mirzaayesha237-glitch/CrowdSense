import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Destination, CrowdReport, CrowdLevel } from '../types';
import { calculateDestinationCrowdSummary, formatTimeAgo } from '../services/crowdAlgorithm';
import { getCurrentUserLocation } from '../services/geoService';
import { Search, Crosshair, Filter, Clock, Users, ArrowRight, ShieldAlert, Sparkles } from 'lucide-react';

interface LeafletMapProps {
  destinations: Destination[];
  reports: CrowdReport[];
  selectedDestinationId: string | null;
  onSelectDestination: (destinationId: string) => void;
  onReportDestination: (destinationId: string) => void;
  isDemoMode: boolean;
}

export const LeafletMap: React.FC<LeafletMapProps> = ({
  destinations,
  reports,
  selectedDestinationId,
  onSelectDestination,
  onReportDestination,
  isDemoMode
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});
  const userMarkerRef = useRef<L.Marker | null>(null);

  const [filterLevel, setFilterLevel] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [locateError, setLocateError] = useState<string | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Center Maharashtra [19.2, 74.2] zoom 7
    const map = L.map(mapContainerRef.current, {
      center: [19.2, 74.2],
      zoom: 7,
      minZoom: 5,
      maxZoom: 18,
      zoomControl: true
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Markers when destinations, reports, or filter change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing destination markers
    Object.values(markersRef.current).forEach(m => m.remove());
    markersRef.current = {};

    destinations.forEach(dest => {
      const { summary } = calculateDestinationCrowdSummary(dest.id, reports);

      // Check filter
      if (filterLevel !== 'ALL' && summary.crowdLevel !== filterLevel) {
        return;
      }

      // Check search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matches =
          dest.name.toLowerCase().includes(query) ||
          dest.city.toLowerCase().includes(query) ||
          dest.category.toLowerCase().includes(query);
        if (!matches) return;
      }

      // Choose Pin Color & Label
      let pinColor = '#64748b'; // GREY - INSUFFICIENT
      let crowdBadge = 'INSUFFICIENT DATA';
      let ringColor = 'rgba(100, 116, 139, 0.4)';

      if (summary.crowdLevel === 'LOW') {
        pinColor = '#059669'; // Emerald Green
        crowdBadge = 'LOW CROWD';
        ringColor = 'rgba(5, 150, 105, 0.4)';
      } else if (summary.crowdLevel === 'MODERATE') {
        pinColor = '#d97706'; // Amber Yellow
        crowdBadge = 'MODERATE';
        ringColor = 'rgba(217, 119, 6, 0.4)';
      } else if (summary.crowdLevel === 'HIGH') {
        pinColor = '#e11d48'; // Rose Red
        crowdBadge = 'HIGH CROWD';
        ringColor = 'rgba(225, 29, 72, 0.4)';
      }

      // Create Custom SVG Marker Icon
      const iconHtml = `
        <div style="position: relative; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; cursor: pointer;">
          <div style="position: absolute; width: 36px; height: 36px; border-radius: 50%; background: ${ringColor}; transform: scale(1.15);"></div>
          <div style="position: relative; width: 28px; height: 28px; border-radius: 50%; background: ${pinColor}; border: 2.5px solid #ffffff; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.25); display: flex; align-items: center; justify-content: center;">
            <div style="width: 8px; height: 8px; border-radius: 50%; background: #ffffff;"></div>
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-crowd-pin',
        html: iconHtml,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
        popupAnchor: [0, -18]
      });

      const marker = L.marker([dest.latitude, dest.longitude], { icon: customIcon });

      // Popup Content
      const popupContent = document.createElement('div');
      popupContent.className = 'p-4 min-w-[240px] text-slate-900 bg-white';
      popupContent.innerHTML = `
        <div class="mb-2">
          <div style="font-size: 10px; font-weight: 700; color: ${pinColor}; text-transform: uppercase; letter-spacing: 0.05em; display: flex; items-center; justify-content: space-between;">
            <span>${crowdBadge}</span>
            ${isDemoMode ? '<span style="color: #d97706;">DEMO DATA</span>' : ''}
          </div>
          <h4 style="font-size: 14px; font-weight: 700; color: #0f172a; margin-top: 2px; margin-bottom: 2px;">${dest.name}</h4>
          <p style="font-size: 11px; color: #64748b;">${dest.city}, ${dest.state}</p>
        </div>

        <div style="background: #f8fafc; border-radius: 6px; padding: 6px 8px; margin-bottom: 10px; font-size: 11px; color: #475569; display: flex; flex-direction: column; gap: 4px;">
          <div style="display: flex; justify-content: space-between;">
            <span>Recent reports:</span>
            <strong style="color: #0f172a;">${summary.recentReportCount}</strong>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span>Last report:</span>
            <strong>${summary.lastUpdated ? formatTimeAgo(summary.lastUpdated) : 'No data'}</strong>
          </div>
        </div>

        <div style="display: flex; gap: 6px;">
          <button id="view-dest-${dest.id}" style="flex: 1; padding: 6px 10px; background: #0f172a; color: #ffffff; border-radius: 6px; font-size: 11px; font-weight: 600; cursor: pointer; border: none; text-align: center;">
            View Details
          </button>
          <button id="rep-dest-${dest.id}" style="padding: 6px 10px; background: #0d9488; color: #ffffff; border-radius: 6px; font-size: 11px; font-weight: 600; cursor: pointer; border: none; text-align: center;">
            Report
          </button>
        </div>
      `;

      // Attach event listeners after popup opens
      marker.on('popupopen', () => {
        const viewBtn = document.getElementById(`view-dest-${dest.id}`);
        if (viewBtn) {
          viewBtn.onclick = () => {
            onSelectDestination(dest.id);
            marker.closePopup();
          };
        }
        const repBtn = document.getElementById(`rep-dest-${dest.id}`);
        if (repBtn) {
          repBtn.onclick = () => {
            onReportDestination(dest.id);
            marker.closePopup();
          };
        }
      });

      marker.bindPopup(popupContent);
      marker.addTo(map);
      markersRef.current[dest.id] = marker;
    });
  }, [destinations, reports, filterLevel, searchQuery, isDemoMode, onSelectDestination, onReportDestination]);

  // Center on selected destination when requested
  useEffect(() => {
    if (!selectedDestinationId || !mapInstanceRef.current) return;
    const dest = destinations.find(d => d.id === selectedDestinationId);
    if (dest) {
      mapInstanceRef.current.flyTo([dest.latitude, dest.longitude], 13, { duration: 1.2 });
      const marker = markersRef.current[selectedDestinationId];
      if (marker) {
        setTimeout(() => marker.openPopup(), 1300);
      }
    }
  }, [selectedDestinationId, destinations]);

  // Handle "Locate Me" button
  const handleLocateUser = async () => {
    setIsLocating(true);
    setLocateError(null);
    const result = await getCurrentUserLocation();
    setIsLocating(false);

    if (result.coords && mapInstanceRef.current) {
      const { latitude, longitude } = result.coords;
      setUserLocation({ lat: latitude, lng: longitude });

      // Update or create user marker
      if (userMarkerRef.current) {
        userMarkerRef.current.setLatLng([latitude, longitude]);
      } else {
        const userIcon = L.divIcon({
          className: 'user-location-pin',
          html: `
            <div style="position: relative; width: 24px; height: 24px;">
              <div style="position: absolute; width: 24px; height: 24px; border-radius: 50%; background: rgba(59, 130, 246, 0.35); transform: scale(1.5);"></div>
              <div style="position: relative; width: 16px; height: 16px; border-radius: 50%; background: #2563eb; border: 2.5px solid #ffffff; box-shadow: 0 2px 4px rgba(0,0,0,0.3); margin: 4px;"></div>
            </div>
          `,
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });

        userMarkerRef.current = L.marker([latitude, longitude], { icon: userIcon })
          .bindPopup('<div class="p-2 text-xs font-semibold text-slate-800">Your Current Location</div>')
          .addTo(mapInstanceRef.current);
      }

      mapInstanceRef.current.flyTo([latitude, longitude], 12, { duration: 1 });
    } else {
      setLocateError(result.error || 'Failed to determine GPS location.');
      setTimeout(() => setLocateError(null), 5000);
    }
  };

  return (
    <div className="relative w-full h-[620px] rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100">
      {/* Top Floating Controls: Search & Filters */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between pointer-events-none">
        {/* Search Input */}
        <div className="relative w-full sm:w-72 pointer-events-auto">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search destination or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/95 backdrop-blur-md border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 shadow-md focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        {/* Filter Tabs (Interactive filter control) */}
        <div className="flex items-center gap-1 p-1 bg-white/95 backdrop-blur-md rounded-lg border border-slate-200 shadow-md pointer-events-auto overflow-x-auto">
          <button
            onClick={() => setFilterLevel('ALL')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              filterLevel === 'ALL'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterLevel('LOW')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              filterLevel === 'LOW'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-emerald-700 hover:bg-emerald-50'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Low</span>
          </button>
          <button
            onClick={() => setFilterLevel('MODERATE')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              filterLevel === 'MODERATE'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-amber-700 hover:bg-amber-50'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <span>Moderate</span>
          </button>
          <button
            onClick={() => setFilterLevel('HIGH')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              filterLevel === 'HIGH'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-rose-700 hover:bg-rose-50'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            <span>High</span>
          </button>
        </div>
      </div>

      {/* Floating Action: Locate User */}
      <div className="absolute bottom-6 right-4 z-20 pointer-events-auto flex flex-col gap-2">
        <button
          onClick={handleLocateUser}
          disabled={isLocating}
          className="p-3 bg-white hover:bg-slate-50 text-slate-800 rounded-lg shadow-lg border border-slate-200 transition-all flex items-center justify-center hover:scale-105 active:scale-95 disabled:opacity-50"
          title="Locate My Position"
        >
          <Crosshair className={`w-5 h-5 text-teal-600 ${isLocating ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Map Legend Overlay */}
      <div className="absolute bottom-6 left-4 z-20 bg-white/95 backdrop-blur-md border border-slate-200 rounded-lg p-3 shadow-lg pointer-events-auto text-xs hidden sm:block max-w-xs">
        <div className="font-semibold text-slate-800 mb-2 flex items-center justify-between">
          <span>Crowd Legend</span>
          {isDemoMode && <span className="text-[10px] text-amber-600 font-bold uppercase">Demo Data</span>}
        </div>
        <div className="space-y-1.5 text-slate-600">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-600 shrink-0"></span>
            <span>Low Crowd (Optimal timing)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-500 shrink-0"></span>
            <span>Moderate Crowd (15–30 min queue)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-600 shrink-0"></span>
            <span>High Crowd (Peak volume / heavy lines)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-slate-400 shrink-0"></span>
            <span>Grey: Insufficient recent data (&lt;2 reports)</span>
          </div>
        </div>
      </div>

      {/* Error Toast if locate fails */}
      {locateError && (
        <div className="absolute top-16 left-4 right-4 sm:left-auto sm:right-4 z-30 bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-lg text-xs shadow-md pointer-events-auto max-w-sm">
          {locateError}
        </div>
      )}

      {/* Leaflet Map Root */}
      <div ref={mapContainerRef} className="w-full h-full z-10" />
    </div>
  );
};
