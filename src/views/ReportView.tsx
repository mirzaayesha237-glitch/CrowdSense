import React, { useState, useEffect } from 'react';
import { Destination, User, CrowdLevel } from '../types';
import { storageService } from '../services/storageService';
import { getCurrentUserLocation, isWithinDestinationProximity, calculateDistanceMeters } from '../services/geoService';
import { MapPin, Navigation, CheckCircle2, AlertTriangle, ShieldCheck, Clock, Award, Sparkles, Info } from 'lucide-react';

interface ReportViewProps {
  destinations: Destination[];
  initialDestinationId?: string;
  currentUser: User;
  onReportSuccess: (destId: string) => void;
  onOpenAuth: () => void;
}

export const ReportView: React.FC<ReportViewProps> = ({
  destinations,
  initialDestinationId,
  currentUser,
  onReportSuccess,
  onOpenAuth
}) => {
  const [selectedDestId, setSelectedDestId] = useState<string>(
    initialDestinationId || destinations[0]?.id || ''
  );
  const [selectedLevel, setSelectedLevel] = useState<'LOW' | 'MODERATE' | 'HIGH' | null>(null);
  const [estimatedWait, setEstimatedWait] = useState<number>(15);
  const [notes, setNotes] = useState<string>('');
  const [isCheckingGps, setIsCheckingGps] = useState<boolean>(false);
  const [gpsStatus, setGpsStatus] = useState<{
    checked: boolean;
    isVerified: boolean;
    distanceMeters?: number;
    errorMsg?: string;
    manualVerified: boolean;
  }>({
    checked: false,
    isVerified: false,
    manualVerified: false
  });

  const [submissionResult, setSubmissionResult] = useState<{
    status: 'idle' | 'success' | 'error';
    message?: string;
    points?: number;
  }>({ status: 'idle' });

  // Destination object
  const currentDestination = destinations.find(d => d.id === selectedDestId);

  // Check cooldown
  const cooldownCheck = storageService.canUserSubmitReport(currentUser.userId, selectedDestId);

  // Automatically check GPS on mount or destination change
  useEffect(() => {
    checkGpsForDestination(selectedDestId);
  }, [selectedDestId]);

  const checkGpsForDestination = async (destId: string) => {
    const dest = destinations.find(d => d.id === destId);
    if (!dest) return;

    setIsCheckingGps(true);
    const locResult = await getCurrentUserLocation();
    setIsCheckingGps(false);

    if (locResult.coords) {
      const { latitude, longitude } = locResult.coords;
      const { isWithin, distanceMeters } = isWithinDestinationProximity(
        latitude,
        longitude,
        dest.latitude,
        dest.longitude
      );
      setGpsStatus({
        checked: true,
        isVerified: isWithin,
        distanceMeters,
        manualVerified: false
      });
    } else {
      setGpsStatus({
        checked: true,
        isVerified: false,
        errorMsg: locResult.error || 'GPS unavailable',
        manualVerified: false
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLevel || !currentDestination) return;

    // Cooldown verification
    if (!cooldownCheck.allowed) {
      setSubmissionResult({
        status: 'error',
        message: `Anti-spam cooldown: You already submitted a report for this location recently. Please wait ${cooldownCheck.waitMinutes} minutes before contributing another report.`
      });
      return;
    }

    const isVerifiedFinal = gpsStatus.isVerified || gpsStatus.manualVerified;

    const result = storageService.submitReport({
      userId: currentUser.userId,
      userName: currentUser.name,
      destinationId: currentDestination.id,
      crowdLevel: selectedLevel,
      isGpsVerified: isVerifiedFinal,
      userDistanceMeters: gpsStatus.distanceMeters,
      isDemo: currentUser.isGuest || false,
      notes: notes.trim() || undefined,
      estimatedWaitMinutes: estimatedWait
    });

    if (result.success) {
      setSubmissionResult({
        status: 'success',
        message: `Report recorded successfully! Your observation has been factored into the live consensus.`,
        points: result.pointsEarned
      });
      setTimeout(() => {
        onReportSuccess(currentDestination.id);
      }, 2500);
    } else {
      setSubmissionResult({
        status: 'error',
        message: result.error || 'Failed to submit report. Please try again.'
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12">
      {/* Title */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
          Report Live Crowd
        </h1>
        <p className="text-sm text-slate-500 max-w-lg mx-auto">
          Help fellow tourists by sharing what you see. Community reports are verified and rewarded with travel points.
        </p>
      </div>

      {/* Success Banner */}
      {submissionResult.status === 'success' && (
        <div className="p-6 bg-teal-50 border border-teal-200 rounded-xl text-teal-900 shadow-sm animate-in fade-in flex items-start gap-4">
          <CheckCircle2 className="w-6 h-6 text-teal-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold text-base text-teal-900">Thank you for contributing!</h4>
            <p className="text-xs text-teal-800">{submissionResult.message}</p>
            <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-teal-700">
              <Award className="w-4 h-4" />
              <span>Earned +{submissionResult.points} Reward Points</span>
            </div>
          </div>
        </div>
      )}

      {/* Error Banner */}
      {submissionResult.status === 'error' && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{submissionResult.message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-8">
        {/* Step 1: Destination Selection */}
        <div className="space-y-3">
          <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider">
            1. Select Tourist Destination
          </label>
          <div className="relative">
            <select
              value={selectedDestId}
              onChange={(e) => {
                setSelectedDestId(e.target.value);
                setSubmissionResult({ status: 'idle' });
              }}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-3 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              {destinations.map(dest => (
                <option key={dest.id} value={dest.id}>
                  {dest.name} — {dest.city} ({dest.category})
                </option>
              ))}
            </select>
          </div>

          {currentDestination && (
            <div className="text-xs text-slate-500 flex items-center gap-2 pt-1">
              <MapPin className="w-3.5 h-3.5 text-teal-600" />
              <span>{currentDestination.description}</span>
            </div>
          )}
        </div>

        {/* Step 2: Location Verification Widget */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Navigation className="w-3.5 h-3.5 text-teal-600" />
              <span>GPS Proximity Verification</span>
            </span>
            <button
              type="button"
              onClick={() => checkGpsForDestination(selectedDestId)}
              disabled={isCheckingGps}
              className="text-xs text-teal-600 font-semibold hover:text-teal-700 disabled:opacity-50"
            >
              {isCheckingGps ? 'Verifying...' : 'Re-check Location'}
            </button>
          </div>

          {/* Status badge */}
          {gpsStatus.isVerified ? (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <div>
                <strong>GPS Verified On-Site:</strong> You are within{' '}
                {gpsStatus.distanceMeters ? `${gpsStatus.distanceMeters}m` : '1.5km'} of this destination.
                Report carries full consensus weight (+25 Points).
              </div>
            </div>
          ) : (
            <div className="p-3 bg-slate-100 border border-slate-200 rounded-lg text-slate-700 text-xs space-y-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <div>
                  <strong>Remote / Unverified Report:</strong>{' '}
                  {gpsStatus.distanceMeters
                    ? `You are approx. ${(gpsStatus.distanceMeters / 1000).toFixed(1)} km away.`
                    : (gpsStatus.errorMsg || 'Browser location not available.')}
                  {' '}Unverified reports earn +10 Points.
                </div>
              </div>

              {/* Hackathon Manual Override / Correction */}
              <label className="flex items-center gap-2 text-[11px] text-slate-600 cursor-pointer pt-1 border-t border-slate-200">
                <input
                  type="checkbox"
                  checked={gpsStatus.manualVerified}
                  onChange={(e) => setGpsStatus(prev => ({ ...prev, manualVerified: e.target.checked }))}
                  className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                />
                <span>I am physically at this location right now (Correction mode for desktop browser testing)</span>
              </label>
            </div>
          )}
        </div>

        {/* Step 3: Three Large Crowd Level Buttons (Section 6 Requirement) */}
        <div className="space-y-3">
          <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider">
            2. What does the crowd look like?
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Green - Low Crowd */}
            <button
              type="button"
              onClick={() => setSelectedLevel('LOW')}
              className={`p-5 rounded-xl border-2 text-left transition-all relative ${
                selectedLevel === 'LOW'
                  ? 'border-emerald-600 bg-emerald-50/80 ring-2 ring-emerald-500/20'
                  : 'border-slate-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/30'
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-emerald-500 mb-3"></div>
              <div className="text-sm font-bold text-emerald-800">LOW CROWD</div>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                "Not many people are here. Minimal lines, calm atmosphere."
              </p>
              <div className="text-[11px] font-mono text-emerald-700 mt-3 font-semibold">
                Est. wait: &lt;10 mins
              </div>
            </button>

            {/* Yellow - Moderate Crowd */}
            <button
              type="button"
              onClick={() => setSelectedLevel('MODERATE')}
              className={`p-5 rounded-xl border-2 text-left transition-all relative ${
                selectedLevel === 'MODERATE'
                  ? 'border-amber-500 bg-amber-50/80 ring-2 ring-amber-500/20'
                  : 'border-slate-200 bg-white hover:border-amber-300 hover:bg-amber-50/30'
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-amber-500 mb-3"></div>
              <div className="text-sm font-bold text-amber-800">MODERATE CROWD</div>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                "There are a moderate number of visitors. Standard queues."
              </p>
              <div className="text-[11px] font-mono text-amber-700 mt-3 font-semibold">
                Est. wait: 15–25 mins
              </div>
            </button>

            {/* Red - High Crowd */}
            <button
              type="button"
              onClick={() => setSelectedLevel('HIGH')}
              className={`p-5 rounded-xl border-2 text-left transition-all relative ${
                selectedLevel === 'HIGH'
                  ? 'border-rose-600 bg-rose-50/80 ring-2 ring-rose-500/20'
                  : 'border-slate-200 bg-white hover:border-rose-300 hover:bg-rose-50/30'
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-rose-500 mb-3"></div>
              <div className="text-sm font-bold text-rose-800">HIGH CROWD</div>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                "The location is very crowded. Heavy rush and packed lines."
              </p>
              <div className="text-[11px] font-mono text-rose-700 mt-3 font-semibold">
                Est. wait: 35–60 mins
              </div>
            </button>
          </div>
        </div>

        {/* Step 4: Optional Observation Notes & Queue Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Estimated Ticket / Entry Wait (Minutes)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="0"
                max="90"
                step="5"
                value={estimatedWait}
                onChange={(e) => setEstimatedWait(Number(e.target.value))}
                className="w-full accent-teal-600"
              />
              <span className="font-mono text-xs font-bold text-slate-800 w-12 text-right">
                {estimatedWait}m
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Optional Note for Other Visitors
            </label>
            <input
              type="text"
              placeholder="e.g. West gate ticket counter is fastest"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              maxLength={120}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>
        </div>

        {/* Cooldown notice if applicable */}
        {!cooldownCheck.allowed && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-xs flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              Cooldown active: You can submit your next report for this attraction in{' '}
              <strong className="font-mono">{cooldownCheck.waitMinutes} minutes</strong>.
            </span>
          </div>
        )}

        {/* Submission CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <div className="text-xs text-slate-500">
            Reporting as: <strong className="text-slate-900">{currentUser.name}</strong>{' '}
            {currentUser.isGuest && '(Guest Hackathon Evaluator)'}
          </div>

          <button
            type="submit"
            disabled={!selectedLevel || !cooldownCheck.allowed}
            className="px-6 py-3 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition-all whitespace-nowrap"
          >
            Submit Crowd Observation
          </button>
        </div>
      </form>
    </div>
  );
};
