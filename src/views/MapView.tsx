import React, { useState } from 'react';
import { Destination, CrowdReport } from '../types';
import { LeafletMap } from '../components/LeafletMap';
import { calculateDestinationCrowdSummary, formatTimeAgo } from '../services/crowdAlgorithm';
import { MapPin, Users, Clock, ArrowRight, ShieldCheck, Search, Filter } from 'lucide-react';

interface MapViewProps {
  destinations: Destination[];
  reports: CrowdReport[];
  selectedDestinationId: string | null;
  onSelectDestination: (destId: string) => void;
  onReportDestination: (destId: string) => void;
  isDemoMode: boolean;
  onToggleDemoModal: () => void;
}

export const MapView: React.FC<MapViewProps> = ({
  destinations,
  reports,
  selectedDestinationId,
  onSelectDestination,
  onReportDestination,
  isDemoMode,
  onToggleDemoModal
}) => {
  const [listSearch, setListSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('ALL');

  const categories = ['ALL', 'Monuments', 'Beaches & Promenades', 'Heritage & Forts', 'Caves & History', 'Nature & Scenic'];

  const filteredDestinations = destinations.filter(dest => {
    if (activeCategory !== 'ALL' && dest.category !== activeCategory) return false;
    if (listSearch.trim()) {
      const q = listSearch.toLowerCase();
      return dest.name.toLowerCase().includes(q) || dest.city.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Live Crowd Map
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time tourist density across Maharashtra heritage monuments and scenic destinations
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onReportDestination(destinations[0]?.id || '')}
            className="px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-500 rounded-lg shadow-xs transition-colors whitespace-nowrap"
          >
            Submit Crowd Report
          </button>
        </div>
      </div>

      {/* Main Grid: Interactive Map + Destination Directory */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Leaflet Map Container */}
        <div className="lg:col-span-8 flex flex-col space-y-4">
          <LeafletMap
            destinations={destinations}
            reports={reports}
            selectedDestinationId={selectedDestinationId}
            onSelectDestination={onSelectDestination}
            onReportDestination={onReportDestination}
            isDemoMode={isDemoMode}
          />

          {/* Quick instructions strip */}
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-900">Interactive Map Tips:</span>
              <span>Click any marker to inspect recent report counts and trigger instant updates.</span>
            </div>
            <button
              onClick={onToggleDemoModal}
              className="text-teal-600 hover:text-teal-700 font-semibold"
            >
              Simulate crowd wave →
            </button>
          </div>
        </div>

        {/* Right Column: Destination Directory List */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col h-[680px]">
          {/* Search & Filter Header */}
          <div className="p-4 border-b border-slate-100 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900">
                Attractions Directory ({filteredDestinations.length})
              </h2>
              <span className="text-[11px] font-mono text-slate-400">Maharashtra</span>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filter attractions..."
                value={listSearch}
                onChange={(e) => setListSearch(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-md pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>

            {/* Category horizontal scroll */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 text-[11px]">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-2 py-0.5 rounded-md whitespace-nowrap transition-colors ${
                    activeCategory === cat
                      ? 'bg-slate-900 text-white font-semibold'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Scrollable list */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2 space-y-1">
            {filteredDestinations.map(dest => {
              const { summary } = calculateDestinationCrowdSummary(dest.id, reports);
              const isSelected = selectedDestinationId === dest.id;

              let dotColor = 'bg-slate-400';
              let badgeColor = 'text-slate-600 bg-slate-100';
              let label = 'Insufficient';

              if (summary.crowdLevel === 'LOW') {
                dotColor = 'bg-emerald-500';
                badgeColor = 'text-emerald-700 bg-emerald-50 border-emerald-200';
                label = 'Low Crowd';
              } else if (summary.crowdLevel === 'MODERATE') {
                dotColor = 'bg-amber-500';
                badgeColor = 'text-amber-700 bg-amber-50 border-amber-200';
                label = 'Moderate';
              } else if (summary.crowdLevel === 'HIGH') {
                dotColor = 'bg-rose-500';
                badgeColor = 'text-rose-700 bg-rose-50 border-rose-200';
                label = 'High Crowd';
              }

              return (
                <div
                  key={dest.id}
                  onClick={() => onSelectDestination(dest.id)}
                  className={`p-3 rounded-lg cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-teal-50/70 border border-teal-200'
                      : 'hover:bg-slate-50 border border-transparent'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="text-xs font-bold text-slate-900 truncate">
                        {dest.name}
                      </h3>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5">
                        <span>{dest.city}</span>
                        <span>·</span>
                        <span>{dest.category}</span>
                      </div>
                    </div>

                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold flex items-center gap-1 shrink-0 ${badgeColor}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`}></span>
                      <span>{label}</span>
                    </span>
                  </div>

                  <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 pt-1.5 border-t border-slate-50">
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3 text-slate-400" />
                      <span className="font-mono">{summary.recentReportCount} reports</span>
                    </div>
                    <span>{summary.lastUpdated ? formatTimeAgo(summary.lastUpdated) : 'No data'}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
