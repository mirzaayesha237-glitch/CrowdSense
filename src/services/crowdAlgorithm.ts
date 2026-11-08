import { CrowdReport, CrowdLevel, DestinationCrowdSummary } from '../types';

/**
 * CrowdSense Crowd Validation Algorithm
 *
 * Mathematical Principles:
 * 1. Recency Window: Only reports submitted within the last 4 hours (240 mins) are active.
 * 2. Linear Time Decay:
 *    weight = max(0.15, 1 - (ageMinutes / 240))
 * 3. GPS Proximity Boost:
 *    GPS-verified reports (<= 1.5km) receive a 1.4x trust weight multiplier.
 * 4. Deduplication:
 *    If a user submitted multiple reports for the same destination, only their newest report is counted.
 * 5. Minimum Sufficiency Threshold:
 *    At least 2 distinct recent reports are required to calculate a crowd level.
 *    Otherwise, status is 'INSUFFICIENT' (GREY).
 * 6. Majority Vote & Weighted Sum:
 *    Levels map to numerical intensities: LOW = 1, MODERATE = 2, HIGH = 3.
 *    Calculates weighted average and votes share.
 */

const MAX_WINDOW_MINUTES = 240; // 4 hours
const MIN_REPORTS_REQUIRED = 2; // threshold for confident display

export interface AlgorithmExplanation {
  totalReportsConsidered: number;
  distinctUsers: number;
  lowWeighted: number;
  moderateWeighted: number;
  highWeighted: number;
  dominantLevel: CrowdLevel;
  confidencePercent: number;
  reasons: string[];
}

export function calculateDestinationCrowdSummary(
  destinationId: string,
  allReports: CrowdReport[],
  nowDate: Date = new Date()
): { summary: DestinationCrowdSummary; explanation: AlgorithmExplanation } {
  const destReports = allReports.filter(r => r.destinationId === destinationId);
  const nowMs = nowDate.getTime();

  // 1. Deduplicate by user: take only latest report per user
  const latestByUser = new Map<string, CrowdReport>();
  destReports.forEach(report => {
    const existing = latestByUser.get(report.userId);
    if (!existing || new Date(report.timestamp).getTime() > new Date(existing.timestamp).getTime()) {
      latestByUser.set(report.userId, report);
    }
  });

  const uniqueReports = Array.from(latestByUser.values());

  // 2. Filter within recency window and calculate weights
  const scoredReports = uniqueReports
    .map(report => {
      const reportMs = new Date(report.timestamp).getTime();
      const ageMinutes = Math.max(0, (nowMs - reportMs) / (60 * 1000));
      return { report, ageMinutes };
    })
    .filter(item => item.ageMinutes <= MAX_WINDOW_MINUTES);

  const breakdown = {
    low: 0,
    moderate: 0,
    high: 0
  };

  let weightedLow = 0;
  let weightedModerate = 0;
  let weightedHigh = 0;
  let lastUpdatedTime = '';
  let newestMs = 0;

  scoredReports.forEach(({ report, ageMinutes }) => {
    // Time decay weight from 1.0 down to 0.15
    const recencyWeight = Math.max(0.15, 1 - ageMinutes / MAX_WINDOW_MINUTES);
    // GPS multiplier
    const gpsMultiplier = report.isGpsVerified ? 1.4 : 1.0;
    const finalWeight = recencyWeight * gpsMultiplier;

    if (report.crowdLevel === 'LOW') {
      breakdown.low += 1;
      weightedLow += finalWeight;
    } else if (report.crowdLevel === 'MODERATE') {
      breakdown.moderate += 1;
      weightedModerate += finalWeight;
    } else if (report.crowdLevel === 'HIGH') {
      breakdown.high += 1;
      weightedHigh += finalWeight;
    }

    const rTime = new Date(report.timestamp).getTime();
    if (rTime > newestMs) {
      newestMs = rTime;
      lastUpdatedTime = report.timestamp;
    }
  });

  const totalValidReports = scoredReports.length;
  const reasons: string[] = [];

  // Check sufficiency
  if (totalValidReports < MIN_REPORTS_REQUIRED) {
    reasons.push(`Insufficient sample: Only ${totalValidReports} report in the last 4 hours (minimum ${MIN_REPORTS_REQUIRED} required).`);
    return {
      summary: {
        destinationId,
        crowdLevel: 'INSUFFICIENT',
        confidenceScore: totalValidReports === 1 ? 30 : 0,
        totalValidReports,
        recentReportCount: totalValidReports,
        lastUpdated: lastUpdatedTime || 'No recent reports',
        breakdown,
        statusText: 'Insufficient recent reports',
        trendDescription: 'Awaiting local visitor updates to establish crowd level'
      },
      explanation: {
        totalReportsConsidered: totalValidReports,
        distinctUsers: uniqueReports.length,
        lowWeighted: 0,
        moderateWeighted: 0,
        highWeighted: 0,
        dominantLevel: 'INSUFFICIENT',
        confidencePercent: totalValidReports === 1 ? 30 : 0,
        reasons
      }
    };
  }

  // Determine dominant level
  let dominantLevel: CrowdLevel = 'MODERATE';
  if (weightedHigh >= weightedModerate && weightedHigh >= weightedLow) {
    dominantLevel = 'HIGH';
  } else if (weightedModerate >= weightedHigh && weightedModerate >= weightedLow) {
    dominantLevel = 'MODERATE';
  } else {
    dominantLevel = 'LOW';
  }

  // Calculate confidence score (based on sample size + consensus strength)
  const totalWeighted = weightedLow + weightedModerate + weightedHigh;
  const maxWeighted = Math.max(weightedLow, weightedModerate, weightedHigh);
  const consensusRatio = totalWeighted > 0 ? maxWeighted / totalWeighted : 0.5;
  
  // Sample size factor: 2 reports = 60%, 4 reports = 85%, 6+ reports = 98%
  const sampleFactor = Math.min(1.0, 0.4 + (totalValidReports * 0.12));
  const confidenceScore = Math.min(99, Math.round((consensusRatio * 0.5 + sampleFactor * 0.5) * 100));

  let statusText = 'Normal Visitor Flow';
  let trendDescription = 'Crowd levels are currently stable';

  if (dominantLevel === 'LOW') {
    statusText = 'Low Crowd · Great Time to Visit';
    trendDescription = 'Minimal waiting time and open pathways across all sections';
  } else if (dominantLevel === 'MODERATE') {
    statusText = 'Moderate Crowd · Expected Wait 15–25m';
    trendDescription = 'Active tourist attendance; standard lines at ticketing & main spots';
  } else if (dominantLevel === 'HIGH') {
    statusText = 'High Crowd · Heavy Congestion';
    trendDescription = 'Peak visitor volume; long queues and heavy pedestrian density';
  }

  reasons.push(`${totalValidReports} verified reports within 4h window.`);
  reasons.push(`Consensus ratio: ${(consensusRatio * 100).toFixed(0)}% agreement for ${dominantLevel}.`);
  reasons.push(`Weighted scores: High=${weightedHigh.toFixed(1)}, Mod=${weightedModerate.toFixed(1)}, Low=${weightedLow.toFixed(1)}.`);

  return {
    summary: {
      destinationId,
      crowdLevel: dominantLevel,
      confidenceScore,
      totalValidReports,
      recentReportCount: totalValidReports,
      lastUpdated: lastUpdatedTime,
      breakdown,
      statusText,
      trendDescription
    },
    explanation: {
      totalReportsConsidered: totalValidReports,
      distinctUsers: uniqueReports.length,
      lowWeighted: weightedLow,
      moderateWeighted: weightedModerate,
      highWeighted: weightedHigh,
      dominantLevel,
      confidencePercent: confidenceScore,
      reasons
    }
  };
}

export function formatTimeAgo(isoString: string): string {
  if (!isoString) return 'Just now';
  const diffMs = Date.now() - new Date(isoString).getTime();
  const minutes = Math.floor(diffMs / (60 * 1000));
  if (minutes < 1) return 'Just now';
  if (minutes === 1) return '1 min ago';
  if (minutes < 60) return `${minutes} mins ago`;
  const hours = Math.floor(minutes / 60);
  if (hours === 1) return '1 hour ago';
  if (hours < 24) return `${hours} hours ago`;
  return `${Math.floor(hours / 24)} days ago`;
}
