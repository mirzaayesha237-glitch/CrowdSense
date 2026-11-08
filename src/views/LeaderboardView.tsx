import React from 'react';
import { User } from '../types';
import { storageService } from '../services/storageService';
import { Trophy, Award, ShieldCheck, Flag, Sparkles } from 'lucide-react';

interface LeaderboardViewProps {
  currentUser: User;
  onSelectTab: (tab: string) => void;
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({
  currentUser,
  onSelectTab
}) => {
  const leaderboard = storageService.getLeaderboard();
  const topThree = leaderboard.slice(0, 3);
  const remaining = leaderboard.slice(3);

  return (
    <div className="space-y-8 pb-16">
      {/* Title */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2 text-xs font-bold text-teal-600 uppercase tracking-wider">
          <Trophy className="w-4 h-4 text-amber-500" />
          <span>Hackathon Contributor Rankings</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
          Community Leaderboard
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
          Recognising verified tourists and local guides powering real-time crowd intelligence across Maharashtra.
        </p>
      </div>

      {/* Top 3 Podium Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        {/* Silver: Rank 2 */}
        {topThree[1] && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col items-center text-center space-y-3 shadow-xs relative md:order-1">
            <div className="w-12 h-12 rounded-full bg-slate-100 border-2 border-slate-300 flex items-center justify-center text-slate-700 font-bold text-base">
              #2
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">{topThree[1].name}</h3>
              <span className="text-[11px] text-slate-500">{topThree[1].topBadge}</span>
            </div>
            <div className="font-mono text-2xl font-extrabold text-slate-900 tabular-nums">
              {topThree[1].rewardPoints} <span className="text-xs text-slate-500 font-sans">pts</span>
            </div>
            <div className="text-xs text-slate-500 flex items-center gap-3 pt-2 border-t border-slate-100 w-full justify-center">
              <span>{topThree[1].acceptedReports} reports</span>
              <span>·</span>
              <span>{topThree[1].verifiedRate}% verified</span>
            </div>
          </div>
        )}

        {/* Gold: Rank 1 */}
        {topThree[0] && (
          <div className="bg-gradient-to-b from-amber-500/10 to-white rounded-2xl border-2 border-amber-400 p-6 flex flex-col items-center text-center space-y-3 shadow-md relative md:order-2 md:-translate-y-2">
            <div className="w-14 h-14 rounded-full bg-amber-400 border-2 border-amber-300 flex items-center justify-center text-slate-950 font-black text-lg shadow-sm">
              <Trophy className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-amber-700 uppercase tracking-widest">
                Top Guide
              </span>
              <h3 className="font-extrabold text-slate-900 text-base">{topThree[0].name}</h3>
              <span className="text-xs text-teal-700 font-semibold">{topThree[0].topBadge}</span>
            </div>
            <div className="font-mono text-3xl font-black text-slate-900 tabular-nums">
              {topThree[0].rewardPoints} <span className="text-xs text-slate-500 font-sans">pts</span>
            </div>
            <div className="text-xs text-slate-600 flex items-center gap-3 pt-2 border-t border-amber-200 w-full justify-center">
              <span className="font-semibold">{topThree[0].acceptedReports} reports</span>
              <span>·</span>
              <span className="text-emerald-700 font-semibold">{topThree[0].verifiedRate}% verified</span>
            </div>
          </div>
        )}

        {/* Bronze: Rank 3 */}
        {topThree[2] && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col items-center text-center space-y-3 shadow-xs relative md:order-3">
            <div className="w-12 h-12 rounded-full bg-amber-900/10 border-2 border-amber-700/30 flex items-center justify-center text-amber-800 font-bold text-base">
              #3
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">{topThree[2].name}</h3>
              <span className="text-[11px] text-slate-500">{topThree[2].topBadge}</span>
            </div>
            <div className="font-mono text-2xl font-extrabold text-slate-900 tabular-nums">
              {topThree[2].rewardPoints} <span className="text-xs text-slate-500 font-sans">pts</span>
            </div>
            <div className="text-xs text-slate-500 flex items-center gap-3 pt-2 border-t border-slate-100 w-full justify-center">
              <span>{topThree[2].acceptedReports} reports</span>
              <span>·</span>
              <span>{topThree[2].verifiedRate}% verified</span>
            </div>
          </div>
        )}
      </div>

      {/* Complete Leaderboard Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Full Contributor Standings</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Ranked dynamically by total accepted crowd intelligence points
            </p>
          </div>
          <button
            onClick={() => onSelectTab('report')}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-500 rounded-lg transition-colors"
          >
            Report to Earn Points
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4 w-16 text-center">Rank</th>
                <th className="py-3 px-4">Contributor</th>
                <th className="py-3 px-4">Milestone Level</th>
                <th className="py-3 px-4 text-center">Accepted Reports</th>
                <th className="py-3 px-4 text-center">Verified Rate</th>
                <th className="py-3 px-4 text-right">Points</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {leaderboard.map(user => {
                const isCurrent = user.isCurrentUser;
                return (
                  <tr
                    key={user.userId}
                    className={`transition-colors ${
                      isCurrent
                        ? 'bg-teal-50/70 font-semibold'
                        : 'hover:bg-slate-50/80'
                    }`}
                  >
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-700">
                      #{user.rank}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-700 text-xs">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <div className="text-slate-900 font-medium flex items-center gap-2">
                            <span>{user.name}</span>
                            {isCurrent && (
                              <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-teal-600 text-white">
                                You
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-medium">
                      {user.topBadge}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono tabular-nums text-slate-700">
                      {user.acceptedReports}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="font-mono tabular-nums text-emerald-700 font-medium">
                        {user.verifiedRate}%
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono tabular-nums font-bold text-slate-900 text-sm">
                      {user.rewardPoints}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Gamification Rules Box */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-teal-400 uppercase tracking-wider">
          Gamification & Anti-Gaming Rules
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
          <div className="p-3 bg-slate-800/80 rounded-xl space-y-1">
            <strong className="text-white">GPS Verified: +25 Pts</strong>
            <p className="text-[11px] text-slate-400">
              Users physically detected within 1.5km of the monument receive full on-site score.
            </p>
          </div>
          <div className="p-3 bg-slate-800/80 rounded-xl space-y-1">
            <strong className="text-white">Remote Report: +10 Pts</strong>
            <p className="text-[11px] text-slate-400">
              Observations submitted from afar carry community unverified tags and lower weight.
            </p>
          </div>
          <div className="p-3 bg-slate-800/80 rounded-xl space-y-1">
            <strong className="text-white">Anti-Spam Limiter</strong>
            <p className="text-[11px] text-slate-400">
              15-minute cooldown between submissions for the same destination stops bot point farming.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
