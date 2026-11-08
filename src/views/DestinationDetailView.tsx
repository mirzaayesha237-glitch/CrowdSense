import React from 'react';
import { Destination, CrowdReport } from '../types';
import { calculateDestinationCrowdSummary, formatTimeAgo } from '../services/crowdAlgorithm';
import { MapPin, Users, Clock, ArrowLeft, ShieldCheck, AlertCircle, Compass, Sparkles, Navigation, Calendar } from 'lucide-react';

interface DestinationDetailViewProps {
  destination: Destination;
  reports: CrowdReport[];
  onBack: () => void;
  onReport: (destId: string) => void;
  onViewOnMap: (destId: string) => void;
  isDemoMode: boolean;
  onOpenSimulator: () => void;
}

export const DestinationDetailView: React.FC<DestinationDetailViewProps> = ({
  destination,
  reports,
  onBack,
  onReport,
  onViewOnMap,
  isDemoMode,
  onOpenSimulator
}) => {
  const { summary, explanation } = calculateDestinationCrowdSummary(destination.id, reports);
  const destReports = reports
    .filter(r => r.destinationId === destination.id)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  // Determine styling based on crowd level
  let themeBadge = {
    bg: 'bg-slate-100',
    text: 'text-slate-700',
    border: 'border-slate-300',
    dot: 'bg-slate-400',
    title: 'Insufficient Data',
    subtitle: 'Awaiting local visitor reports to calculate consensus.'
  };

  if (summary.crowdLevel === 'LOW') {
    themeBadge = {
      bg: 'bg-emerald-50',
      text: 'text-emerald-800',
      border: 'border-emerald-300',
      dot: 'bg-emerald-500',
      title: 'Low Crowd Level',
      subtitle: 'Optimal conditions. Short ticketing lines and comfortable space.'
    };
  } else if (summary.crowdLevel === 'MODERATE') {
    themeBadge = {
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      border: 'border-amber-300',
      dot: 'bg-amber-500',
      title: 'Moderate Crowd Level',
      subtitle: 'Steady tourist turnout. Expect 15 to 25 minute waits for admission.'
    };
  } else if (summary.crowdLevel === 'HIGH') {
    themeBadge = {
      bg: 'bg-rose-50',
      text: 'text-rose-800',
      border: 'border-rose-300',
      dot: 'bg-rose-500',
      title: 'High Crowd Level',
      subtitle: 'Heavy visitor congestion. Extensive wait times and full parking.'
    };
  }

  // Calculate percentage breakdown for bar
  const totalVotes = summary.breakdown.low + summary.breakdown.moderate + summary.breakdown.high;
  const pctLow = totalVotes > 0 ? Math.round((summary.breakdown.low / totalVotes) * 100) : 0;
  const pctMod = totalVotes > 0 ? Math.round((summary.breakdown.moderate / totalVotes) * 100) : 0;
  const pctHigh = totalVotes > 0 ? Math.round((summary.breakdown.high / totalVotes) * 100) : 0;

  // Typical Hourly Trends pattern (model based on destination category)
  const hourlyTrend = [
    { time: '08:00', level: 'LOW', height: '25%', label: '8 AM' },
    { time: '10:00', level: 'MODERATE', height: '55%', label: '10 AM' },
    { time: '12:00', level: 'HIGH', height: '85%', label: '12 PM' },
    { time: '14:00', level: 'HIGH', height: '90%', label: '2 PM' },
    { time: '16:00', level: 'HIGH', height: '80%', label: '4 PM' },
    { time: '18:00', level: 'MODERATE', height: '60%', label: '6 PM' },
    { time: '20:00', level: 'LOW', height: '30%', label: '8 PM' },
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* Top back button and actions */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Destinations</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onViewOnMap(destination.id)}
            className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Compass className="w-3.5 h-3.5 text-teal-600" />
            <span>Center on Live Map</span>
          </button>

          <button
            onClick={() => onReport(destination.id)}
            className="px-4 py-1.5 text-xs font-bold text-white bg-teal-600 hover:bg-teal-500 rounded-lg shadow-xs transition-colors"
          >
            Report Here
          </button>
        </div>
      </div>

      {/* Hero Banner with destination photograph */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-md bg-slate-900 text-white min-h-[340px] flex flex-col justify-end">
        <img
          src={destination.image}
          alt={destination.name}
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover object-center brightness-[0.78]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

        <div className="relative z-10 p-6 sm:p-10 space-y-3">
          <div className="flex items-center gap-2 text-xs text-teal-300 font-semibold tracking-wide uppercase">
            <span>{destination.city}, {destination.state}</span>
            <span>·</span>
            <span>{destination.category}</span>
            {isDemoMode && (
              <>
                <span>·</span>
                <span className="text-amber-400">DEMO VERIFIED</span>
              </>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            {destination.name}
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            {destination.description}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-6 text-xs text-slate-300 font-medium">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-teal-400" />
              <span>Hours: {destination.openingHours}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-teal-400" />
              <span>Best Time: {destination.bestTimeToVisit}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Status Summary + Real-time History */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Live Status & Consensus */}
        <div className="lg:col-span-7 space-y-6">
          {/* Current Status Card */}
          <div className={`p-6 rounded-2xl border ${themeBadge.border} ${themeBadge.bg} space-y-4`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${themeBadge.dot}`}></span>
                <span className={`text-base font-bold uppercase tracking-wider ${themeBadge.text}`}>
                  {themeBadge.title}
                </span>
              </div>
              <span className="text-xs font-mono text-slate-500">
                Updated {summary.lastUpdated ? formatTimeAgo(summary.lastUpdated) : 'No data'}
              </span>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed">
              {themeBadge.subtitle}
            </p>

            {/* Voting Consensus Bar */}
            <div className="space-y-2 pt-2 border-t border-slate-200/60">
              <div className="flex justify-between text-xs text-slate-600">
                <span className="font-semibold text-slate-800">Community Consensus Breakdown</span>
                <span className="font-mono tabular-nums">{totalVotes} valid reports</span>
              </div>

              {totalVotes > 0 ? (
                <div className="h-3 rounded-full overflow-hidden flex bg-slate-200">
                  <div style={{ width: `${pctLow}%` }} className="bg-emerald-500" title={`Low: ${pctLow}%`} />
                  <div style={{ width: `${pctMod}%` }} className="bg-amber-500" title={`Moderate: ${pctMod}%`} />
                  <div style={{ width: `${pctHigh}%` }} className="bg-rose-500" title={`High: ${pctHigh}%`} />
                </div>
              ) : (
                <div className="h-3 rounded-full bg-slate-200 text-center text-[10px] text-slate-500 leading-3">
                  Insufficient votes
                </div>
              )}

              <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                <span className="text-emerald-700">Low ({pctLow}%)</span>
                <span className="text-amber-700">Moderate ({pctMod}%)</span>
                <span className="text-rose-700">High ({pctHigh}%)</span>
              </div>
            </div>

            {/* Hackathon Algorithm Breakdown Note */}
            <div className="p-3 bg-white/80 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1.5">
              <div className="font-bold text-slate-900 flex items-center justify-between">
                <span>Validation Algorithm Transparency:</span>
                <span className="font-mono text-teal-700">Confidence: {summary.confidenceScore}%</span>
              </div>
              <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-500">
                {explanation.reasons.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Historical / Typical Crowd Trends Chart */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Typical Hourly Crowd Curve</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Peak times: <strong className="text-slate-800">{destination.typicalPeakHours}</strong>
                </p>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">Average Weekend Curve</span>
            </div>

            <div className="pt-4 h-44 flex items-end justify-between gap-3 px-2 border-b border-slate-100">
              {hourlyTrend.map((item, idx) => {
                let barColor = 'bg-emerald-400';
                if (item.level === 'MODERATE') barColor = 'bg-amber-400';
                if (item.level === 'HIGH') barColor = 'bg-rose-400';

                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                    <div className="text-[10px] font-mono text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.level}
                    </div>
                    <div
                      style={{ height: item.height }}
                      className={`w-full rounded-t-md ${barColor} group-hover:brightness-95 transition-all`}
                    />
                    <span className="text-[11px] font-mono text-slate-500 mt-1">
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
              <span>Mornings (8-10 AM) offer the lowest footfall.</span>
              <button
                onClick={onOpenSimulator}
                className="text-teal-600 hover:text-teal-700 font-semibold"
              >
                Simulate different conditions →
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Recent Reports Log */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Recent Visitor Reports ({destReports.length})
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Submissions within the active consensus window
              </p>
            </div>
            <button
              onClick={() => onReport(destination.id)}
              className="text-xs font-semibold text-teal-600 hover:text-teal-700"
            >
              + Add Report
            </button>
          </div>

          <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
            {destReports.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400">
                No reports submitted recently. Be the first to report from this destination!
              </div>
            ) : (
              destReports.map(report => {
                let badgeColor = 'bg-emerald-100 text-emerald-800';
                if (report.crowdLevel === 'MODERATE') badgeColor = 'bg-amber-100 text-amber-800';
                if (report.crowdLevel === 'HIGH') badgeColor = 'bg-rose-100 text-rose-800';

                return (
                  <div
                    key={report.reportId}
                    className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/70 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{report.userName}</span>
                        {report.isGpsVerified ? (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-teal-50 text-teal-700 border border-teal-200 flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3 text-teal-600" />
                            <span>GPS Verified</span>
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600">
                            Remote
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] font-mono text-slate-400">
                        {formatTimeAgo(report.timestamp)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-md font-bold text-[11px] ${badgeColor}`}>
                        {report.crowdLevel} CROWD
                      </span>
                      {report.estimatedWaitMinutes !== undefined && (
                        <span className="text-slate-500 font-mono text-[11px]">
                          Wait: ~{report.estimatedWaitMinutes}m
                        </span>
                      )}
                      {report.isDemo && (
                        <span className="text-[10px] text-amber-600 font-semibold">
                          [DEMO DATA]
                        </span>
                      )}
                    </div>

                    {report.notes && (
                      <p className="text-slate-600 text-[11px] leading-relaxed pt-1 border-t border-slate-200/50">
                        "{report.notes}"
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
