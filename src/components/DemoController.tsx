import React, { useState } from 'react';
import { Destination } from '../types';
import { storageService } from '../services/storageService';
import { Sparkles, RotateCcw, AlertTriangle, CheckCircle2, X, ChevronRight, Zap } from 'lucide-react';

interface DemoControllerProps {
  isOpen: boolean;
  onClose: () => void;
  destinations: Destination[];
  onSelectDestination?: (destId: string) => void;
}

export const DemoController: React.FC<DemoControllerProps> = ({
  isOpen,
  onClose,
  destinations,
  onSelectDestination
}) => {
  const [selectedDestId, setSelectedDestId] = useState<string>(
    destinations[0]?.id || 'dest_gateway_mumbai'
  );
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSimulate = (level: 'LOW' | 'MODERATE' | 'HIGH') => {
    storageService.simulateCrowdWave(selectedDestId, level, 3);
    const dest = destinations.find(d => d.id === selectedDestId);
    setStatusMessage(
      `Injected 3 simulated ${level} crowd reports for ${dest?.name || 'destination'}. Map and crowd status updated!`
    );
    if (onSelectDestination) {
      onSelectDestination(selectedDestId);
    }
    setTimeout(() => setStatusMessage(null), 5000);
  };

  const handleReset = () => {
    storageService.resetDemoData();
    setStatusMessage('All data reset to initial demo state!');
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const selectedDest = destinations.find(d => d.id === selectedDestId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl max-w-xl w-full p-6 text-white relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-2 text-amber-400">
          <Sparkles className="w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-wider">Hackathon Evaluation Panel</span>
        </div>

        <h3 className="text-xl font-bold tracking-tight mb-2">Crowd Simulation Controller</h3>
        <p className="text-slate-300 text-xs mb-5 leading-relaxed">
          Allows judges to simulate real-time crowd spikes or off-peak periods, demonstrating how the consensus algorithm recalibrates destination status immediately.
        </p>

        {statusMessage && (
          <div className="mb-4 p-3 bg-teal-950/80 border border-teal-600/60 rounded-lg text-teal-200 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* Step 1: Destination Selection */}
        <div className="mb-4">
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            1. Select Target Destination
          </label>
          <select
            value={selectedDestId}
            onChange={(e) => setSelectedDestId(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-teal-500"
          >
            {destinations.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name} ({d.city})
              </option>
            ))}
          </select>
        </div>

        {/* Step 2: Simulation Actions */}
        <div className="mb-6">
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            2. Trigger Simulated Crowd Wave (Injects 3 Verified Reports)
          </label>
          <div className="grid grid-cols-3 gap-2.5">
            <button
              onClick={() => handleSimulate('LOW')}
              className="p-3 rounded-lg border border-emerald-600/40 bg-emerald-950/40 hover:bg-emerald-900/50 text-left transition-colors group"
            >
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 mb-2"></div>
              <div className="text-xs font-bold text-emerald-300 group-hover:text-emerald-200">Low Crowd</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Off-peak breeze</div>
            </button>

            <button
              onClick={() => handleSimulate('MODERATE')}
              className="p-3 rounded-lg border border-amber-600/40 bg-amber-950/40 hover:bg-amber-900/50 text-left transition-colors group"
            >
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500 mb-2"></div>
              <div className="text-xs font-bold text-amber-300 group-hover:text-amber-200">Moderate Crowd</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Standard queues</div>
            </button>

            <button
              onClick={() => handleSimulate('HIGH')}
              className="p-3 rounded-lg border border-rose-600/40 bg-rose-950/40 hover:bg-rose-900/50 text-left transition-colors group"
            >
              <div className="w-2.5 h-2.5 rounded-full bg-rose-500 mb-2"></div>
              <div className="text-xs font-bold text-rose-300 group-hover:text-rose-200">High Crowd</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Heavy congestion</div>
            </button>
          </div>
        </div>

        {/* Info note */}
        <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700/60 mb-5 flex items-start gap-2.5 text-xs text-slate-300">
          <Zap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="text-white">Validation rule in play:</strong> Reports decay linearly over 4 hours.
            Reports submitted on-site carry 1.4x weight. When you trigger a wave, the consensus updates live on the map and destination analytics without page reload.
          </div>
        </div>

        {/* Footer controls */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-rose-400 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset To Default Baseline</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white font-medium text-xs rounded-lg transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
