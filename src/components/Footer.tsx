import React from 'react';
import { Compass, ShieldCheck } from 'lucide-react';

interface FooterProps {
  onSelectTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab }) => {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
                <Compass className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">CrowdSense</span>
            </div>
            <p className="text-slate-400 text-xs max-w-md leading-relaxed">
              Know Before You Go. Community-powered tourist crowd density monitoring and wait-time intelligence platform designed for the College Hackathon 2026.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              <span>Independent crowdsourced verification with GPS proximity scoring</span>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <div className="text-xs font-semibold text-white tracking-wide uppercase mb-3">Navigation</div>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onSelectTab('map')} className="hover:text-teal-400 transition-colors">
                  Live Crowd Map
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('report')} className="hover:text-teal-400 transition-colors">
                  Submit Crowd Report
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('leaderboard')} className="hover:text-teal-400 transition-colors">
                  Community Leaderboard
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('dashboard')} className="hover:text-teal-400 transition-colors">
                  Contributor Dashboard
                </button>
              </li>
            </ul>
          </div>

          {/* Hackathon Specs */}
          <div>
            <div className="text-xs font-semibold text-white tracking-wide uppercase mb-3">Hackathon Context</div>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onSelectTab('about')} className="hover:text-teal-400 transition-colors">
                  Crowd Validation Algorithm
                </button>
              </li>
              <li>
                <span className="text-slate-500">Region: Maharashtra, India</span>
              </li>
              <li>
                <span className="text-slate-500">Map: Leaflet & OpenStreetMap</span>
              </li>
              <li>
                <span className="text-slate-500">Anti-Spam: 15-min cooldown window</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <div>
            © {new Date().getFullYear()} CrowdSense. Built for the College Innovation Hackathon.
          </div>
          <div className="flex items-center gap-4">
            <span className="text-slate-600">Sample data clearly distinguished from live records</span>
            <button
              onClick={() => onSelectTab('about')}
              className="text-slate-400 hover:text-white transition-colors"
            >
              Methodology
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
