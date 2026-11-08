import React, { useState } from 'react';
import { ShieldCheck, Compass, Clock, Calculator, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { calculateDestinationCrowdSummary } from '../services/crowdAlgorithm';
import { CrowdReport } from '../types';

interface AboutViewProps {
  onSelectTab: (tab: string) => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onSelectTab }) => {
  // Interactive Algorithm Sandbox State
  const [testHighCount, setTestHighCount] = useState<number>(4);
  const [testModCount, setTestModCount] = useState<number>(1);
  const [testLowCount, setTestLowCount] = useState<number>(0);
  const [testGpsVerified, setTestGpsVerified] = useState<boolean>(true);

  // Generate synthetic test reports for the calculator
  const syntheticReports: CrowdReport[] = [];
  let idCounter = 1;

  for (let i = 0; i < testHighCount; i++) {
    syntheticReports.push({
      reportId: `test_h_${idCounter++}`,
      userId: `user_h_${i}`,
      userName: `Reporter H${i + 1}`,
      destinationId: 'sandbox_dest',
      crowdLevel: 'HIGH',
      timestamp: new Date(Date.now() - (i * 15 + 10) * 60 * 1000).toISOString(),
      isGpsVerified: testGpsVerified,
      isDemo: true
    });
  }

  for (let i = 0; i < testModCount; i++) {
    syntheticReports.push({
      reportId: `test_m_${idCounter++}`,
      userId: `user_m_${i}`,
      userName: `Reporter M${i + 1}`,
      destinationId: 'sandbox_dest',
      crowdLevel: 'MODERATE',
      timestamp: new Date(Date.now() - (i * 30 + 20) * 60 * 1000).toISOString(),
      isGpsVerified: testGpsVerified,
      isDemo: true
    });
  }

  for (let i = 0; i < testLowCount; i++) {
    syntheticReports.push({
      reportId: `test_l_${idCounter++}`,
      userId: `user_l_${i}`,
      userName: `Reporter L${i + 1}`,
      destinationId: 'sandbox_dest',
      crowdLevel: 'LOW',
      timestamp: new Date(Date.now() - (i * 45 + 40) * 60 * 1000).toISOString(),
      isGpsVerified: testGpsVerified,
      isDemo: true
    });
  }

  const { summary, explanation } = calculateDestinationCrowdSummary('sandbox_dest', syntheticReports);

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-16">
      {/* Title */}
      <div className="text-center space-y-3">
        <div className="flex items-center justify-center gap-2 text-xs font-bold text-teal-600 uppercase tracking-wider">
          <Compass className="w-4 h-4" />
          <span>Transparency & Methodology</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
          CrowdSense Architecture & Algorithm
        </h1>
        <p className="text-sm text-slate-500 max-w-2xl mx-auto leading-relaxed">
          How CrowdSense transforms distributed tourist reports into high-confidence crowd indicators using time-decay weighting, GPS proximity, and majority consensus.
        </p>
      </div>

      {/* The 4 Core Principles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-teal-700 font-bold text-sm">
            <Clock className="w-4 h-4" />
            <span>1. 4-Hour Time-Decay Weighting</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Crowd conditions change quickly. Reports lose statistical influence linearly over 240 minutes according to:
          </p>
          <div className="p-3 bg-slate-900 text-teal-300 font-mono text-xs rounded-lg">
            weight = Math.max(0.15, 1 - (ageMinutes / 240))
          </div>
          <p className="text-[11px] text-slate-500">
            A report submitted 15 minutes ago carries ~0.94 weight, while a report from 3 hours ago carries only ~0.25 weight. Reports older than 4 hours are entirely retired.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-teal-700 font-bold text-sm">
            <ShieldCheck className="w-4 h-4" />
            <span>2. GPS Proximity Multiplier (1.4x)</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            The browser Geolocation API computes the Haversine distance between the reporter and destination:
          </p>
          <div className="p-3 bg-slate-900 text-teal-300 font-mono text-xs rounded-lg">
            d = 2R · atan2(√a, √(1-a))  [≤ 1,500m → 1.4x]
          </div>
          <p className="text-[11px] text-slate-500">
            On-site visitors receive a 1.4x trust multiplier. Remote observations are welcomed (+10 pts) but transparently flagged as unverified.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-teal-700 font-bold text-sm">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span>3. Minimum Sufficiency Rule (N ≥ 2)</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            A single report could be an anomaly or an accidental misclick. CrowdSense mandates at least 2 distinct recent submissions before computing a crowd level.
          </p>
          <p className="text-[11px] text-slate-500">
            When N &lt; 2, the marker is displayed in <strong>GREY — INSUFFICIENT DATA</strong>. Never pretend there is consensus when data is scarce.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-teal-700 font-bold text-sm">
            <ShieldCheck className="w-4 h-4 text-rose-500" />
            <span>4. Anti-Spam & User Deduplication</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            - Deduplication: If a single user submits 4 reports, only their newest report is counted in the window.
          </p>
          <p className="text-xs text-slate-600 leading-relaxed">
            - Cooldown: Users must wait 15 minutes between submissions for the same destination, stopping automated script point-farming.
          </p>
        </div>
      </div>

      {/* Interactive Algorithm Sandbox */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-teal-600" />
            <h2 className="text-lg font-bold text-slate-900">
              Interactive Algorithm Simulator
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-500">Real-Time Evaluation</span>
        </div>

        <p className="text-xs text-slate-600">
          Adjust the sliders below to test how varying combinations of recent High, Moderate, and Low reports affect the resulting status and confidence score.
        </p>

        {/* Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
          <div className="space-y-2">
            <label className="text-xs font-bold text-rose-700 flex justify-between">
              <span>High Crowd Reports</span>
              <span className="font-mono">{testHighCount}</span>
            </label>
            <input
              type="range"
              min="0"
              max="10"
              value={testHighCount}
              onChange={(e) => setTestHighCount(Number(e.target.value))}
              className="w-full accent-rose-600"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-amber-700 flex justify-between">
              <span>Moderate Reports</span>
              <span className="font-mono">{testModCount}</span>
            </label>
            <input
              type="range"
              min="0"
              max="10"
              value={testModCount}
              onChange={(e) => setTestModCount(Number(e.target.value))}
              className="w-full accent-amber-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-emerald-700 flex justify-between">
              <span>Low Crowd Reports</span>
              <span className="font-mono">{testLowCount}</span>
            </label>
            <input
              type="range"
              min="0"
              max="10"
              value={testLowCount}
              onChange={(e) => setTestLowCount(Number(e.target.value))}
              className="w-full accent-emerald-600"
            />
          </div>
        </div>

        {/* Checkbox for GPS */}
        <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer pt-2">
          <input
            type="checkbox"
            checked={testGpsVerified}
            onChange={(e) => setTestGpsVerified(e.target.checked)}
            className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
          />
          <span>Reports submitted with verified GPS on-site (1.4x trust multiplier)</span>
        </label>

        {/* Result Output Display */}
        <div className="p-5 rounded-xl bg-slate-900 text-white space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-400">
              Algorithm Output
            </span>
            <span className="text-xs font-mono text-slate-400">
              Total reports: {testHighCount + testModCount + testLowCount}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
            <div className="flex items-center gap-3">
              <div className={`w-4 h-4 rounded-full ${
                summary.crowdLevel === 'HIGH'
                  ? 'bg-rose-500'
                  : summary.crowdLevel === 'MODERATE'
                  ? 'bg-amber-500'
                  : summary.crowdLevel === 'LOW'
                  ? 'bg-emerald-500'
                  : 'bg-slate-500'
              }`} />
              <div className="text-lg font-bold">
                {summary.crowdLevel} CROWD STATUS
              </div>
            </div>

            <div className="text-xs text-teal-300 font-mono">
              Consensus Confidence: {summary.confidenceScore}%
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800 text-xs text-slate-300 space-y-1">
            {explanation.reasons.map((r, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-teal-400">▸</span>
                <span>{r}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* College Hackathon Scope Notice */}
      <div className="p-6 bg-slate-100 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-2">
        <h3 className="font-bold text-slate-900 text-sm">College Hackathon 2026 Scope & Disclosure</h3>
        <p className="leading-relaxed">
          CrowdSense was architected as a production-grade hackathon prototype. All sample landmark data is explicitly marked as <strong>[DEMO DATA]</strong> to avoid misleading users. The application employs zero paid APIs, relying purely on OpenStreetMap tiles via Leaflet and browser standards (Geolocation API, LocalStorage persistence).
        </p>
        <div className="pt-2">
          <button
            onClick={() => onSelectTab('map')}
            className="text-teal-600 hover:text-teal-700 font-semibold flex items-center gap-1.5"
          >
            <span>Explore live map with preloaded Maharashtra data</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
