export type CrowdLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'INSUFFICIENT';

export type UserRole = 'tourist' | 'local_guide' | 'admin';

export interface User {
  userId: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: UserRole;
  rewardPoints: number;
  acceptedReports: number;
  createdAt: string;
  isGuest?: boolean;
}

export interface Destination {
  id: string;
  name: string;
  city: string;
  state: string;
  category: 'Monuments' | 'Nature & Scenic' | 'Heritage & Forts' | 'Beaches & Promenades' | 'Caves & History';
  latitude: number;
  longitude: number;
  description: string;
  bestTimeToVisit: string;
  openingHours: string;
  image: string;
  typicalPeakHours: string;
}

export interface CrowdReport {
  reportId: string;
  userId: string;
  userName: string;
  destinationId: string;
  crowdLevel: 'LOW' | 'MODERATE' | 'HIGH';
  timestamp: string; // ISO string
  isGpsVerified: boolean;
  userDistanceMeters?: number;
  isDemo: boolean;
  notes?: string;
  estimatedWaitMinutes?: number;
}

export interface DestinationCrowdSummary {
  destinationId: string;
  crowdLevel: CrowdLevel;
  confidenceScore: number; // 0 to 100
  totalValidReports: number;
  recentReportCount: number; // within last 4 hours
  lastUpdated: string;
  breakdown: {
    low: number;
    moderate: number;
    high: number;
  };
  statusText: string;
  trendDescription: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  iconName: string;
  earnedAt?: string;
  requiredCount: number;
  currentProgress: number;
}

export interface LeaderboardUser {
  rank: number;
  userId: string;
  name: string;
  avatarUrl?: string;
  rewardPoints: number;
  acceptedReports: number;
  verifiedRate: number; // percentage
  topBadge: string;
  isCurrentUser?: boolean;
}
