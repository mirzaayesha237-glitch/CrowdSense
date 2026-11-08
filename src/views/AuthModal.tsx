import React, { useState } from 'react';
import { User } from '../types';
import { storageService } from '../services/storageService';
import { X, UserCheck, LogIn, UserPlus, Sparkles, ShieldCheck } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser
}) => {
  const [tab, setTab] = useState<'login' | 'signup' | 'switch'>('switch');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const allUsers = storageService.getAllUsers();

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setErrorMsg('Please enter both your name and email address.');
      return;
    }

    try {
      storageService.registerUser(name.trim(), email.trim());
      setErrorMsg(null);
      onClose();
    } catch {
      setErrorMsg('Failed to create account. Please try again.');
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMsg('Please enter your email.');
      return;
    }

    const found = storageService.loginUser(email.trim());
    if (found) {
      setErrorMsg(null);
      onClose();
    } else {
      setErrorMsg('No user account found with that email. Try signing up or picking a test account below.');
    }
  };

  const handleQuickSwitch = (user: User) => {
    storageService.setCurrentUser(user);
    onClose();
  };

  const handleContinueAsGuest = () => {
    storageService.logoutUser();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 text-slate-900 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-800 rounded-md hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-1 mb-6">
          <div className="flex items-center gap-2 text-xs font-bold text-teal-600 uppercase tracking-wider">
            <UserCheck className="w-4 h-4" />
            <span>CrowdSense Accounts</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            {tab === 'switch' ? 'Select or Switch Account' : tab === 'login' ? 'Log In to CrowdSense' : 'Create Contributor Account'}
          </h2>
          <p className="text-xs text-slate-500">
            {tab === 'switch'
              ? 'Easily switch between simulated profiles or your personal account.'
              : 'Earn points and unlock badges by reporting crowd observations.'}
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center p-1 bg-slate-100 rounded-lg mb-5 text-xs font-medium">
          <button
            onClick={() => { setTab('switch'); setErrorMsg(null); }}
            className={`flex-1 py-1.5 rounded-md transition-all ${
              tab === 'switch' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Quick Switch
          </button>
          <button
            onClick={() => { setTab('login'); setErrorMsg(null); }}
            className={`flex-1 py-1.5 rounded-md transition-all ${
              tab === 'login' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Log In
          </button>
          <button
            onClick={() => { setTab('signup'); setErrorMsg(null); }}
            className={`flex-1 py-1.5 rounded-md transition-all ${
              tab === 'signup' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sign Up (+20 Pts)
          </button>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-xs">
            {errorMsg}
          </div>
        )}

        {/* Tab 1: Quick Switch Profiles */}
        {tab === 'switch' && (
          <div className="space-y-4">
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {allUsers.map((u) => {
                const isSelected = u.userId === currentUser.userId;
                return (
                  <button
                    key={u.userId}
                    onClick={() => handleQuickSwitch(u)}
                    className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                      isSelected
                        ? 'border-teal-500 bg-teal-50/70 shadow-xs'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-700 text-xs">
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-xs text-slate-900 flex items-center gap-2">
                          <span>{u.name}</span>
                          {isSelected && (
                            <span className="text-[10px] text-teal-700 font-semibold bg-teal-100 px-1.5 rounded">
                              Current
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500">{u.email}</div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-mono text-xs font-bold text-slate-900">{u.rewardPoints} pts</span>
                      <div className="text-[10px] text-slate-400">{u.role}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            <button
              onClick={handleContinueAsGuest}
              className="w-full py-2.5 text-xs text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg font-medium transition-colors"
            >
              Reset to Guest / Judge Mode
            </button>
          </div>
        )}

        {/* Tab 2: Login */}
        {tab === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. aarav.m@example.com"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg transition-colors"
            >
              Sign In
            </button>
          </form>
        )}

        {/* Tab 3: Sign Up */}
        {tab === 'signup' && (
          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rajesh Patil"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. rajesh@example.com"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Create Account</span>
              <span className="text-[10px] bg-teal-700 px-1.5 py-0.5 rounded text-white">+20 Pts Bonus</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
