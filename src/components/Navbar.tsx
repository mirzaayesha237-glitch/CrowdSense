import React, { useState } from 'react';
import { User } from '../types';
import { Menu, X, Compass, ShieldAlert, Sparkles, UserCheck } from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  currentUser: User;
  onOpenAuth: () => void;
  isDemoMode: boolean;
  onToggleDemoModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  currentUser,
  onOpenAuth,
  isDemoMode,
  onToggleDemoModal
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'map', label: 'Live Map' },
    { id: 'report', label: 'Report Crowd' },
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'leaderboard', label: 'Leaderboard' },
    { id: 'about', label: 'About & Algorithm' },
  ];

  const handleTabClick = (id: string) => {
    onSelectTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900 text-white border-b border-slate-800 backdrop-blur-md">
      {/* Hackathon Demo Banner */}
      {isDemoMode && (
        <div className="bg-gradient-to-r from-amber-900/90 via-slate-900 to-amber-900/90 px-4 py-1.5 text-xs text-amber-200 border-b border-amber-700/50 flex items-center justify-between">
          <div className="flex items-center gap-2 mx-auto">
            <span className="font-semibold tracking-wide uppercase text-[11px] text-amber-300">Demo Mode Active</span>
            <span className="text-amber-400/80">·</span>
            <span>Preloaded Maharashtra tourist data for Hackathon evaluation</span>
            <button
              onClick={onToggleDemoModal}
              className="ml-2 underline font-semibold hover:text-white transition-colors"
            >
              Open Simulation Controls
            </button>
          </div>
        </div>
      )}

      {/* Main Top Bar Contract: 3 zones separated by gap-8 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={() => handleTabClick('home')}
          className="flex items-center gap-2.5 text-left group shrink-0"
        >
          <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 group-hover:bg-teal-500 group-hover:text-slate-950 transition-colors">
            <Compass className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-white group-hover:text-teal-400 transition-colors whitespace-nowrap">
              CrowdSense
            </span>
          </div>
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`transition-colors whitespace-nowrap py-1 relative ${
                  isActive
                    ? 'text-teal-400 font-semibold'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-400 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Single Primary Action & Profile */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onToggleDemoModal}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-teal-300 bg-teal-950/60 border border-teal-800/80 rounded-md hover:bg-teal-900/60 transition-colors whitespace-nowrap"
            title="Open Judge Simulation Panel"
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            <span>Simulate</span>
          </button>

          <button
            onClick={onOpenAuth}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-white bg-slate-800 border border-slate-700 rounded-md hover:border-slate-500 transition-all whitespace-nowrap"
          >
            <UserCheck className="w-3.5 h-3.5 text-teal-400" />
            <span className="max-w-[120px] truncate">{currentUser.name}</span>
            <span className="text-teal-400 font-mono tabular-nums text-[11px] font-bold">
              {currentUser.rewardPoints} pts
            </span>
          </button>

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-400 hover:text-white rounded-md hover:bg-slate-800"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={`block w-full text-left px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                currentTab === item.id
                  ? 'bg-teal-500/10 text-teal-400 font-semibold'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onToggleDemoModal();
              }}
              className="text-xs text-amber-400 flex items-center gap-1.5 font-medium py-1.5"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Judge Simulator Panel</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
