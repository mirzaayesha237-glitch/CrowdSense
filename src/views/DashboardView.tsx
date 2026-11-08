import React from 'react';
import { User, CrowdReport, Destination } from '../types';
import { storageService } from '../services/storageService';
import { formatTimeAgo } from '../services/crowdAlgorithm';
import { Award, ShieldCheck, MapPin, Flag, Eye, Compass, Trophy, UserCheck, ArrowRight, Clock } from 'lucide-react';

interface DashboardViewProps {
  currentUser: User;
  reports: CrowdReport[];
  destinations: Destination[];
  onSelectTab: (tab: string) => void;
  onOpenAuth: () => void;
  onSelectDestination: (destId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  currentUser,
  reports,
  destinations,
  onSelectTab,
  onOpenAuth,
  onSelectDestination
}) => {
  const badges = storageService.getUserBadges(currentUser.userId);
  const leaderboard = storageService.getLeaderboard();
  const userRankEntry = leaderboard.find(u => u.userId === currentUser.userId);
  const userRank = userRankEntry ? userRankEntry.rank : 1;

  // Filter user's personal reports
  const userReports = reports
    .filter(r => r.userId === currentUser.userId)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const verifiedReports = userReports.filter(r => r.isGpsVerified).length;
  const verifiedRate = userReports.length > 0 ? Math.round((verifiedReports / userReports.length) * 100) : 100;

  const getBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case 'Flag': return <Flag className="w-5 h-5 text-teal-600" />;
      case 'Eye': return <Eye className="w-5 h-5 text-teal-600" />;
      case 'MapPin': return <MapPin className="w-5 h-5 text-teal-600" />;
      case 'Compass': return <Compass className="w-5 h-5 text-teal-600" />;
      case 'Award': return <Award className="w-5 h-5 text-amber-500" />;
      default: return <Trophy className="w-5 h-5 text-teal-600" />;
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Welcome & Profile Header */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400 font-extrabold text-2xl shrink-0">
            {currentUser.name.charAt(0)}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-white">{currentUser.name}</h1>
              {currentUser.isGuest ? (
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-950/80 text-amber-300 border border-amber-800">
                  Guest Evaluator
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-teal-950/80 text-teal-300 border border-teal-800">
                  Verified Contributor
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400">
              {currentUser.email} · Contributor since {new Date(currentUser.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenAuth}
            className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors whitespace-nowrap"
          >
            Switch Account
          </button>
          <button
            onClick={() => onSelectTab('report')}
            className="px-5 py-2 text-xs font-bold text-slate-950 bg-teal-400 hover:bg-teal-300 rounded-lg shadow-xs transition-colors whitespace-nowrap"
          >
            Report Crowd
          </button>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Points */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold uppercase tracking-wider text-[11px]">Reward Points</span>
            <Award className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
            {currentUser.rewardPoints}
          </div>
          <p className="text-[11px] text-slate-500">
            Next badge unlocks at 150 pts
          </p>
        </div>

        {/* Accepted Reports */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold uppercase tracking-wider text-[11px]">Accepted Reports</span>
            <Flag className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
            {currentUser.acceptedReports}
          </div>
          <p className="text-[11px] text-slate-500">
            {verifiedReports} on-site GPS verified
          </p>
        </div>

        {/* Verified Rate */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold uppercase tracking-wider text-[11px]">Verification Rate</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
            {verifiedRate}%
          </div>
          <p className="text-[11px] text-slate-500">
            Higher trust score multiplier
          </p>
        </div>

        {/* Leaderboard Rank */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold uppercase tracking-wider text-[11px]">Community Rank</span>
            <Trophy className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
            #{userRank}
          </div>
          <p className="text-[11px] text-slate-500">
            Out of {leaderboard.length} hackathon evaluators
          </p>
        </div>
      </div>

      {/* Main Grid: Achievement Badges + Activity Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Badges (Gamification) */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Achievement Badges</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Earn milestone badges as you contribute real crowd data
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md">
              {badges.filter(b => b.currentProgress >= b.requiredCount).length} / {badges.length} Unlocked
            </span>
          </div>

          <div className="space-y-4">
            {badges.map(badge => {
              const isEarned = badge.currentProgress >= badge.requiredCount;
              const progressPct = Math.min(100, Math.round((badge.currentProgress / badge.requiredCount) * 100));

              return (
                <div
                  key={badge.id}
                  className={`p-4 rounded-xl border transition-all ${
                    isEarned
                      ? 'bg-teal-50/40 border-teal-200'
                      : 'bg-slate-50/60 border-slate-200 opacity-75'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2.5 rounded-lg border ${
                      isEarned ? 'bg-white border-teal-300' : 'bg-slate-100 border-slate-200 text-slate-400'
                    }`}>
                      {getBadgeIcon(badge.iconName)}
                    </div>

                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-900">{badge.name}</span>
                        {isEarned ? (
                          <span className="text-[10px] font-bold text-teal-700 uppercase tracking-wide">
                            Unlocked
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono text-slate-500">
                            {badge.currentProgress} / {badge.requiredCount}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        {badge.description}
                      </p>

                      {/* Progress bar */}
                      <div className="pt-1">
                        <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                          <div
                            style={{ width: `${progressPct}%` }}
                            className={`h-full rounded-full ${isEarned ? 'bg-teal-500' : 'bg-slate-400'}`}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: User Contribution Timeline */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Your Recent Contributions</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                History of crowd submissions across destinations
              </p>
            </div>
            <button
              onClick={() => onSelectTab('report')}
              className="text-xs font-semibold text-teal-600 hover:text-teal-700"
            >
              + New Report
            </button>
          </div>

          <div className="space-y-3">
            {userReports.length === 0 ? (
              <div className="text-center py-12 space-y-3">
                <Clock className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs text-slate-500">
                  No crowd reports submitted yet.
                </p>
                <button
                  onClick={() => onSelectTab('report')}
                  className="px-4 py-2 text-xs font-semibold text-white bg-teal-600 rounded-lg hover:bg-teal-500"
                >
                  Submit Your First Report (+25 Pts)
                </button>
              </div>
            ) : (
              userReports.map(rep => {
                const destination = destinations.find(d => d.id === rep.destinationId);
                let badgeColor = 'bg-emerald-100 text-emerald-800';
                if (rep.crowdLevel === 'MODERATE') badgeColor = 'bg-amber-100 text-amber-800';
                if (rep.crowdLevel === 'HIGH') badgeColor = 'bg-rose-100 text-rose-800';

                return (
                  <div
                    key={rep.reportId}
                    className="p-4 rounded-xl border border-slate-100 bg-slate-50 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => destination && onSelectDestination(destination.id)}
                        className="font-bold text-slate-900 hover:text-teal-600 transition-colors text-left"
                      >
                        {destination ? destination.name : 'Destination'}
                      </button>
                      <span className="text-[11px] font-mono text-slate-400">
                        {formatTimeAgo(rep.timestamp)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${badgeColor}`}>
                        {rep.crowdLevel} CROWD
                      </span>
                      {rep.isGpsVerified ? (
                        <span className="text-[11px] text-teal-700 font-semibold flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" />
                          <span>GPS Verified (+25 Pts)</span>
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-500">
                          Remote Report (+10 Pts)
                        </span>
                      )}
                    </div>

                    {rep.notes && (
                      <p className="text-slate-600 text-[11px] italic pt-1 border-t border-slate-200/40">
                        "{rep.notes}"
                      </p>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
