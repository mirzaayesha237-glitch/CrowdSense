import { User, Destination, CrowdReport, Badge, LeaderboardUser } from '../types';
import { INITIAL_DESTINATIONS, INITIAL_DEMO_REPORTS, INITIAL_USERS, DEFAULT_CURRENT_USER } from '../data/mockData';

const STORAGE_KEYS = {
  DESTINATIONS: 'crowdsense_destinations_v1',
  REPORTS: 'crowdsense_reports_v1',
  USERS: 'crowdsense_users_v1',
  CURRENT_USER: 'crowdsense_current_user_v1',
  DEMO_MODE_ACTIVE: 'crowdsense_demo_mode_v1'
};

class StorageService {
  private listeners: (() => void)[] = [];

  constructor() {
    this.initStorage();
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(l => l());
  }

  private initStorage() {
    if (!localStorage.getItem(STORAGE_KEYS.DESTINATIONS)) {
      localStorage.setItem(STORAGE_KEYS.DESTINATIONS, JSON.stringify(INITIAL_DESTINATIONS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.REPORTS)) {
      localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(INITIAL_DEMO_REPORTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER)) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(DEFAULT_CURRENT_USER));
    }
    if (localStorage.getItem(STORAGE_KEYS.DEMO_MODE_ACTIVE) === null) {
      localStorage.setItem(STORAGE_KEYS.DEMO_MODE_ACTIVE, 'true'); // Demo mode active by default for hackathon judging
    }
  }

  // Destinations
  public getDestinations(): Destination[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DESTINATIONS);
      return data ? JSON.parse(data) : INITIAL_DESTINATIONS;
    } catch {
      return INITIAL_DESTINATIONS;
    }
  }

  public getDestinationById(id: string): Destination | undefined {
    return this.getDestinations().find(d => d.id === id);
  }

  // Reports
  public getReports(): CrowdReport[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.REPORTS);
      return data ? JSON.parse(data) : INITIAL_DEMO_REPORTS;
    } catch {
      return INITIAL_DEMO_REPORTS;
    }
  }

  public getReportsForDestination(destinationId: string): CrowdReport[] {
    return this.getReports()
      .filter(r => r.destinationId === destinationId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  public canUserSubmitReport(userId: string, destinationId: string): { allowed: boolean; waitMinutes?: number } {
    // If in demo mode simulation, allow quick repeated submissions for testing
    if (this.isDemoMode()) {
      return { allowed: true };
    }

    const reports = this.getReports().filter(r => r.userId === userId && r.destinationId === destinationId);
    if (reports.length === 0) return { allowed: true };

    const newest = reports.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
    const diffMs = Date.now() - new Date(newest.timestamp).getTime();
    const cooldownMs = 15 * 60 * 1000; // 15 mins anti-spam

    if (diffMs < cooldownMs) {
      const remainingMinutes = Math.ceil((cooldownMs - diffMs) / (60 * 1000));
      return { allowed: false, waitMinutes: remainingMinutes };
    }

    return { allowed: true };
  }

  public submitReport(reportData: Omit<CrowdReport, 'reportId' | 'timestamp'>): { success: boolean; error?: string; report?: CrowdReport; pointsEarned: number } {
    const userCheck = this.canUserSubmitReport(reportData.userId, reportData.destinationId);
    if (!userCheck.allowed) {
      return {
        success: false,
        error: `Anti-spam cooldown: You already reported on this destination recently. Please wait ${userCheck.waitMinutes} minutes.`,
        pointsEarned: 0
      };
    }

    const newReport: CrowdReport = {
      ...reportData,
      reportId: 'rep_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      timestamp: new Date().toISOString()
    };

    const currentReports = this.getReports();
    currentReports.unshift(newReport);
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(currentReports));

    // Award points
    const pointsAwarded = newReport.isGpsVerified ? 25 : 10;
    this.addPointsToUser(newReport.userId, pointsAwarded, 1);

    this.notify();
    return { success: true, report: newReport, pointsEarned: pointsAwarded };
  }

  // Users & Auth
  public getCurrentUser(): User {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      return data ? JSON.parse(data) : DEFAULT_CURRENT_USER;
    } catch {
      return DEFAULT_CURRENT_USER;
    }
  }

  public setCurrentUser(user: User) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    // Also update in all users array if registered
    const allUsers = this.getAllUsers();
    const idx = allUsers.findIndex(u => u.userId === user.userId);
    if (idx >= 0) {
      allUsers[idx] = user;
    } else {
      allUsers.push(user);
    }
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(allUsers));
    this.notify();
  }

  public getAllUsers(): User[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USERS);
      return data ? JSON.parse(data) : INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  }

  public registerUser(name: string, email: string): User {
    const newUser: User = {
      userId: 'user_' + Date.now(),
      name,
      email,
      role: 'tourist',
      rewardPoints: 20, // Welcome signup bonus
      acceptedReports: 0,
      createdAt: new Date().toISOString(),
      isGuest: false
    };

    const allUsers = this.getAllUsers();
    allUsers.push(newUser);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(allUsers));
    this.setCurrentUser(newUser);
    return newUser;
  }

  public loginUser(email: string): User | null {
    const allUsers = this.getAllUsers();
    const found = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      this.setCurrentUser(found);
      return found;
    }
    return null;
  }

  public logoutUser() {
    this.setCurrentUser(DEFAULT_CURRENT_USER);
  }

  public addPointsToUser(userId: string, points: number, reportCountDelta: number = 0) {
    const currentUser = this.getCurrentUser();
    if (currentUser.userId === userId) {
      currentUser.rewardPoints += points;
      currentUser.acceptedReports += reportCountDelta;
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
    }

    const allUsers = this.getAllUsers();
    const target = allUsers.find(u => u.userId === userId);
    if (target) {
      target.rewardPoints += points;
      target.acceptedReports += reportCountDelta;
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(allUsers));
    }
  }

  // Badges Calculation
  public getUserBadges(userId: string): Badge[] {
    const reports = this.getReports().filter(r => r.userId === userId);
    const user = this.getCurrentUser().userId === userId ? this.getCurrentUser() : (this.getAllUsers().find(u => u.userId === userId) || DEFAULT_CURRENT_USER);
    
    const verifiedReportsCount = reports.filter(r => r.isGpsVerified).length;
    const uniqueDestinationsCount = new Set(reports.map(r => r.destinationId)).size;

    return [
      {
        id: 'badge_first_reporter',
        name: 'First Reporter',
        description: 'Submitted your first crowd report to the community.',
        iconName: 'Flag',
        requiredCount: 1,
        currentProgress: Math.min(1, reports.length),
        earnedAt: reports.length >= 1 ? reports[reports.length - 1].timestamp : undefined
      },
      {
        id: 'badge_crowd_observer',
        name: 'Crowd Observer',
        description: 'Contributed 3 crowd observations across destinations.',
        iconName: 'Eye',
        requiredCount: 3,
        currentProgress: Math.min(3, reports.length),
        earnedAt: reports.length >= 3 ? reports[2].timestamp : undefined
      },
      {
        id: 'badge_travel_contributor',
        name: 'Travel Contributor',
        description: 'Submitted 5 GPS-verified on-site crowd reports.',
        iconName: 'MapPin',
        requiredCount: 5,
        currentProgress: Math.min(5, verifiedReportsCount),
        earnedAt: verifiedReportsCount >= 5 ? reports[4].timestamp : undefined
      },
      {
        id: 'badge_local_explorer',
        name: 'Local Explorer',
        description: 'Reported on crowd conditions in at least 3 distinct attractions.',
        iconName: 'Compass',
        requiredCount: 3,
        currentProgress: Math.min(3, uniqueDestinationsCount),
        earnedAt: uniqueDestinationsCount >= 3 ? reports[2].timestamp : undefined
      },
      {
        id: 'badge_crowdsense_champion',
        name: 'CrowdSense Champion',
        description: 'Earned 150 or more verified travel community points.',
        iconName: 'Award',
        requiredCount: 150,
        currentProgress: Math.min(150, user.rewardPoints),
        earnedAt: user.rewardPoints >= 150 ? user.createdAt : undefined
      }
    ];
  }

  // Leaderboard
  public getLeaderboard(): LeaderboardUser[] {
    const users = this.getAllUsers();
    const currentUser = this.getCurrentUser();

    // Include currentUser if not already in list
    const combinedUsers = [...users];
    if (!combinedUsers.some(u => u.userId === currentUser.userId)) {
      combinedUsers.push(currentUser);
    }

    const allReports = this.getReports();

    const ranked: LeaderboardUser[] = combinedUsers.map(user => {
      const userReports = allReports.filter(r => r.userId === user.userId);
      const verifiedCount = userReports.filter(r => r.isGpsVerified).length;
      const verifiedRate = userReports.length > 0 ? Math.round((verifiedCount / userReports.length) * 100) : 100;

      let topBadge = 'Explorer';
      if (user.rewardPoints >= 200) topBadge = 'CrowdSense Champion';
      else if (user.rewardPoints >= 120) topBadge = 'Master Guide';
      else if (user.rewardPoints >= 60) topBadge = 'Travel Contributor';

      return {
        rank: 1,
        userId: user.userId,
        name: user.name,
        rewardPoints: user.rewardPoints,
        acceptedReports: Math.max(user.acceptedReports, userReports.length),
        verifiedRate,
        topBadge,
        isCurrentUser: user.userId === currentUser.userId
      };
    });

    // Sort descending by points
    ranked.sort((a, b) => b.rewardPoints - a.rewardPoints);
    ranked.forEach((item, index) => {
      item.rank = index + 1;
    });

    return ranked;
  }

  // Demo Mode management
  public isDemoMode(): boolean {
    return localStorage.getItem(STORAGE_KEYS.DEMO_MODE_ACTIVE) === 'true';
  }

  public setDemoMode(active: boolean) {
    localStorage.setItem(STORAGE_KEYS.DEMO_MODE_ACTIVE, active ? 'true' : 'false');
    this.notify();
  }

  public simulateCrowdWave(destinationId: string, level: 'LOW' | 'MODERATE' | 'HIGH', count: number = 3) {
    const currentReports = this.getReports();
    const destination = this.getDestinationById(destinationId);
    const destName = destination ? destination.name : 'Destination';

    const names = [
      'Pooja Shinde',
      'Kunal Verma',
      'Anand Kulkarni',
      'Sunita Nair',
      'Farhan Shaikh',
      'Ritika Roy'
    ];

    for (let i = 0; i < count; i++) {
      const randomName = names[Math.floor(Math.random() * names.length)];
      const sampleReport: CrowdReport = {
        reportId: 'sim_' + Date.now() + '_' + i,
        userId: 'sim_user_' + i + '_' + Date.now(),
        userName: randomName,
        destinationId,
        crowdLevel: level,
        timestamp: new Date(Date.now() - (i * 2 + 1) * 60 * 1000).toISOString(),
        isGpsVerified: true,
        userDistanceMeters: Math.floor(Math.random() * 200) + 20,
        isDemo: true,
        notes: `[Simulated Report for Demo] Real-time observation at ${destName}: ${level.toLowerCase()} crowd detected.`,
        estimatedWaitMinutes: level === 'HIGH' ? 45 : level === 'MODERATE' ? 20 : 5
      };
      currentReports.unshift(sampleReport);
    }

    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(currentReports));
    this.notify();
  }

  public resetDemoData() {
    localStorage.setItem(STORAGE_KEYS.DESTINATIONS, JSON.stringify(INITIAL_DESTINATIONS));
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(INITIAL_DEMO_REPORTS));
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(DEFAULT_CURRENT_USER));
    localStorage.setItem(STORAGE_KEYS.DEMO_MODE_ACTIVE, 'true');
    this.notify();
  }
}

export const storageService = new StorageService();
