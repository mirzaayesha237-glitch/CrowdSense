import React from 'react';
import { Destination, CrowdReport } from '../types';
import { calculateDestinationCrowdSummary, formatTimeAgo } from '../services/crowdAlgorithm';
import { MapPin, Users, Clock, ShieldCheck, ArrowRight, Compass, Sparkles, Award } from 'lucide-react';

interface LandingViewProps {
  destinations: Destination[];
  reports: CrowdReport[];
  onSelectTab: (tab: string) => void;
  onSelectDestination: (destId: string) => void;
  onOpenAuth: () => void;
}

export const LandingView: React.FC<LandingViewProps> = ({
  destinations,
  reports,
  onSelectTab,
  onSelectDestination,
  onOpenAuth
}) => {
  const featuredDestinations = destinations.slice(0, 4);

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[520px]">
          {/* Left Column: Headline & Intent */}
          <div className="lg:col-span-7 p-8 sm:p-12 lg:p-16 flex flex-col justify-center space-y-6 z-10">
            <div className="flex items-center gap-2 text-xs font-semibold text-teal-400 tracking-wider uppercase">
              <Compass className="w-4 h-4" />
              <span>Real-Time Crowd Intelligence Platform</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white text-balance leading-tight">
              Know Before <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-cyan-300 to-teal-200">
                You Go.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed text-pretty">
              Discover tourist destinations, check live crowd levels, and travel smarter with CrowdSense community crowd intelligence.
            </p>

            {/* Call To Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onSelectTab('map')}
                className="px-5 py-3 text-sm font-semibold text-slate-950 bg-teal-400 hover:bg-teal-300 rounded-lg shadow-md transition-all flex items-center gap-2 whitespace-nowrap"
              >
                <span>Explore Live Map</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onSelectTab('report')}
                className="px-5 py-3 text-sm font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-all whitespace-nowrap"
              >
                Report Crowd
              </button>

              <button
                onClick={onOpenAuth}
                className="px-4 py-3 text-sm font-medium text-slate-300 hover:text-white transition-colors whitespace-nowrap"
              >
                Get Started
              </button>
            </div>

            {/* Trust points */}
            <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-6 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-teal-400" />
                <span>GPS-Verified Ground Truth</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-teal-400" />
                <span>4-Hour Time-Decay Consensus</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-teal-400" />
                <span>Community Reward Points</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Photography */}
          <div className="lg:col-span-5 relative min-h-[300px] lg:min-h-full">
            <img
              src="/src/assets/images/hero_crowdsense_1794061943655.jpg"
              alt="Tourists visiting Gateway of India Mumbai promenade at sunset"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent lg:bg-gradient-to-r lg:from-slate-900 lg:via-transparent lg:to-transparent" />
            
            {/* Live Indicator Overlay */}
            <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-700/80 text-white shadow-xl">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-teal-400">Gateway of India · Mumbai</span>
                <span className="font-mono text-slate-400 text-[11px]">Updated 18m ago</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                  <span className="text-sm font-bold text-rose-300">High Crowd Detected</span>
                </div>
                <span className="text-xs text-slate-300">Wait: ~35 mins</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Destinations Spotlight */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Live Popular Destinations
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Real-time crowd consensus across prominent Maharashtra heritage landmarks
            </p>
          </div>
          <button
            onClick={() => onSelectTab('map')}
            className="text-sm font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1.5 self-start sm:self-auto"
          >
            <span>View all on map</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredDestinations.map((dest) => {
            const { summary } = calculateDestinationCrowdSummary(dest.id, reports);

            let statusColor = 'text-slate-600';
            let dotColor = 'bg-slate-400';
            let statusLabel = 'Insufficient Data';

            if (summary.crowdLevel === 'LOW') {
              statusColor = 'text-emerald-700';
              dotColor = 'bg-emerald-600';
              statusLabel = 'Low Crowd';
            } else if (summary.crowdLevel === 'MODERATE') {
              statusColor = 'text-amber-700';
              dotColor = 'bg-amber-500';
              statusLabel = 'Moderate';
            } else if (summary.crowdLevel === 'HIGH') {
              statusColor = 'text-rose-700';
              dotColor = 'bg-rose-600';
              statusLabel = 'High Crowd';
            }

            return (
              <div
                key={dest.id}
                onClick={() => onSelectDestination(dest.id)}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col"
              >
                <div className="h-44 relative overflow-hidden bg-slate-100">
                  <img
                    src={dest.image}
                    alt={dest.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Subtle corner badge */}
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-md text-xs font-semibold shadow-xs flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${dotColor}`}></span>
                    <span className={statusColor}>{statusLabel}</span>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-bold text-slate-900 text-base group-hover:text-teal-600 transition-colors">
                      {dest.name}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                      <span>{dest.city}</span>
                      <span>·</span>
                      <span>{dest.category}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span>{summary.recentReportCount} reports</span>
                    </div>
                    <span>{summary.lastUpdated ? formatTimeAgo(summary.lastUpdated) : 'No recent reports'}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-slate-100/70 rounded-2xl p-8 sm:p-12 border border-slate-200">
        <div className="max-w-2xl mx-auto text-center space-y-3 mb-10">
          <div className="text-xs font-semibold text-teal-600 uppercase tracking-wider">
            Community Intelligence Engine
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
            How CrowdSense Works
          </h2>
          <p className="text-slate-600 text-sm">
            Empowering tourists through distributed crowd sensing, cryptographic anti-spam, and weighted majority agreement.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 font-bold">
              01
            </div>
            <h3 className="text-base font-bold text-slate-900">Check Live Heatmaps</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Explore interactive OpenStreetMap pins color-coded by verified density. Check estimated wait times and peak hour charts before leaving your hotel.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 font-bold">
              02
            </div>
            <h3 className="text-base font-bold text-slate-900">Report In 1-Tap</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              When visiting, choose Green, Yellow, or Red. Our system checks your device coordinates via the Geolocation API to award higher trust multipliers.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 font-bold">
              03
            </div>
            <h3 className="text-base font-bold text-slate-900">Earn Badges & Rewards</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Gain 25 points for verified on-site reports. Unlock badges from First Reporter to CrowdSense Champion, and rise on the college hackathon leaderboard.
            </p>
          </div>
        </div>
      </section>

      {/* Tourist Benefits */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="text-xs font-semibold text-teal-600 uppercase tracking-wider">
              Travel Smarter
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 text-balance">
              Never get stuck in two-hour tourist bottlenecks again.
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Just like Google Maps revolutionised road traffic by aggregating mobile drivers, CrowdSense brings transparent crowdsourced intelligence directly into historical monuments, national parks, and scenic lookouts.
            </p>
          </div>

          <div className="space-y-4 text-sm text-slate-700">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                ✓
              </div>
              <div>
                <strong className="text-slate-900">Avoid Overcrowded Hours:</strong> Plan monument visits during serene morning slots or late afternoon openings.
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                ✓
              </div>
              <div>
                <strong className="text-slate-900">Save Waiting Time:</strong> Transparent queue indicators help families and elderly travelers budget their travel schedule.
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                ✓
              </div>
              <div>
                <strong className="text-slate-900">Transparent Anti-Spam:</strong> 15-minute submission cooldown and 4-hour mathematical decay prevent stale or manipulated data.
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => onSelectTab('report')}
              className="px-5 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
            >
              Submit Your First Crowd Report
            </button>
          </div>
        </div>

        <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 space-y-6">
          <h3 className="text-lg font-bold text-teal-400">
            Crowd Density Matrix
          </h3>
          <div className="space-y-3">
            <div className="p-3.5 rounded-lg bg-slate-800/80 border border-emerald-500/30">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-emerald-400 text-xs uppercase tracking-wider">Green · Low Crowd</span>
                <span className="text-[11px] text-slate-400 font-mono">0–10 mins queue</span>
              </div>
              <p className="text-xs text-slate-300">
                Light attendance. Clean photography angles and unhindered movement throughout the monument.
              </p>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-800/80 border border-amber-500/30">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-amber-400 text-xs uppercase tracking-wider">Yellow · Moderate Crowd</span>
                <span className="text-[11px] text-slate-400 font-mono">15–25 mins queue</span>
              </div>
              <p className="text-xs text-slate-300">
                Active tourist influx. Standard ticketing lines and steady courtyard flow.
              </p>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-800/80 border border-rose-500/30">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-rose-400 text-xs uppercase tracking-wider">Red · High Crowd</span>
                <span className="text-[11px] text-slate-400 font-mono">35–60 mins queue</span>
              </div>
              <p className="text-xs text-slate-300">
                Congested entry points, long security queues, limited parking, and packed viewing terraces.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
