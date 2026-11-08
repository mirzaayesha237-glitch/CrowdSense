import { Destination, CrowdReport, User } from '../types';

export const INITIAL_DESTINATIONS: Destination[] = [
  {
    id: 'dest_gateway_mumbai',
    name: 'Gateway of India',
    city: 'Mumbai',
    state: 'Maharashtra',
    category: 'Monuments',
    latitude: 18.9220,
    longitude: 72.8347,
    description: 'Iconic 20th-century basalt stone arch monument built to commemorate the landing of King George V. Popular harbor promenade with ferries to Elephanta.',
    bestTimeToVisit: 'Early morning (6:30 AM - 9:00 AM) or late evening',
    openingHours: 'Open 24 hours (Ferries: 9:00 AM - 5:30 PM)',
    typicalPeakHours: '4:30 PM - 8:30 PM weekends',
    image: '/src/assets/images/dest_gateway_mumbai_1794061943498.jpg',
  },
  {
    id: 'dest_marine_drive',
    name: 'Marine Drive (Queen\'s Necklace)',
    city: 'Mumbai',
    state: 'Maharashtra',
    category: 'Beaches & Promenades',
    latitude: 18.9432,
    longitude: 72.8230,
    description: '3.6-kilometer-long arc shaped coastal boulevard alongside Netaji Subhash Chandra Bose Road, offering panoramic Arabian Sea vistas.',
    bestTimeToVisit: 'Early morning for joggers or post 9:30 PM for quiet breezes',
    openingHours: 'Open 24 hours',
    typicalPeakHours: '6:00 PM - 10:00 PM',
    image: '/src/assets/images/dest_marine_drive_1794061943839.jpg',
  },
  {
    id: 'dest_shaniwar_wada',
    name: 'Shaniwar Wada',
    city: 'Pune',
    state: 'Maharashtra',
    category: 'Heritage & Forts',
    latitude: 18.5196,
    longitude: 73.8553,
    description: 'Historical 18th-century fortification in the heart of Pune city built in 1732 as the seat of the Peshwa rulers of the Maratha Empire.',
    bestTimeToVisit: '9:30 AM - 11:30 AM on weekdays',
    openingHours: '9:30 AM - 5:30 PM daily (Light & Sound: 7:00 PM)',
    typicalPeakHours: '2:00 PM - 5:30 PM',
    image: '/src/assets/images/dest_shaniwar_wada_1794061944263.jpg',
  },
  {
    id: 'dest_aga_khan_palace',
    name: 'Aga Khan Palace',
    city: 'Pune',
    state: 'Maharashtra',
    category: 'Monuments',
    latitude: 18.5524,
    longitude: 73.9015,
    description: 'Majestic Italian-arched palace built in 1892 by Sultan Muhammed Shah Aga Khan III. Served as a prison for Mahatma Gandhi during the Quit India movement.',
    bestTimeToVisit: '10:00 AM - 1:00 PM',
    openingHours: '9:00 AM - 5:30 PM daily',
    typicalPeakHours: '12:00 PM - 3:00 PM',
    image: '/src/assets/images/hero_crowdsense_1794061943655.jpg',
  },
  {
    id: 'dest_ajanta_caves',
    name: 'Ajanta Caves',
    city: 'Chhatrapati Sambhajinagar',
    state: 'Maharashtra',
    category: 'Caves & History',
    latitude: 20.5519,
    longitude: 75.7033,
    description: 'UNESCO World Heritage site comprising 30 rock-cut Buddhist cave monuments dating from the 2nd century BCE, famous for world-renowned wall paintings.',
    bestTimeToVisit: 'Morning entry (9:00 AM) right as gates open',
    openingHours: '9:00 AM - 5:00 PM (Closed on Mondays)',
    typicalPeakHours: '11:00 AM - 3:30 PM',
    image: '/src/assets/images/dest_ajanta_caves_1794061944106.jpg',
  },
  {
    id: 'dest_ellora_caves',
    name: 'Ellora Caves & Kailasa Temple',
    city: 'Chhatrapati Sambhajinagar',
    state: 'Maharashtra',
    category: 'Caves & History',
    latitude: 20.0268,
    longitude: 75.1793,
    description: 'Monumental complex of 34 Hindu, Buddhist, and Jain cave temples carved out of Charanandri Hills, featuring the colossal monolithic Cave 16 Kailasa Temple.',
    bestTimeToVisit: '8:00 AM - 11:00 AM',
    openingHours: '6:00 AM - 6:00 PM (Closed on Tuesdays)',
    typicalPeakHours: '1:00 PM - 4:30 PM',
    image: '/src/assets/images/dest_ajanta_caves_1794061944106.jpg',
  },
  {
    id: 'dest_lonavala_tiger_point',
    name: 'Lonavala — Tiger\'s Point & Bhushi Dam',
    city: 'Lonavala',
    state: 'Maharashtra',
    category: 'Nature & Scenic',
    latitude: 18.7297,
    longitude: 73.4072,
    description: 'Popular Western Ghats hill station cliff point offering a sheer drop of over 650 meters, renowned for waterfall mists and lush misty viewpoints.',
    bestTimeToVisit: 'Sunrise (6:00 AM - 8:00 AM)',
    openingHours: '6:00 AM - 6:30 PM daily',
    typicalPeakHours: '11:00 AM - 5:30 PM on weekends',
    image: '/src/assets/images/hero_crowdsense_1794061943655.jpg',
  },
  {
    id: 'dest_sinhagad_fort',
    name: 'Sinhagad Fort',
    city: 'Pune',
    state: 'Maharashtra',
    category: 'Heritage & Forts',
    latitude: 18.3663,
    longitude: 73.7559,
    description: 'Ancient hill fortress situated on an isolated cliff of the Bhuleswar range in the Sahyadris, famous for the Battle of Sinhagad in 1670 led by Tanaji Malusare.',
    bestTimeToVisit: 'Early morning trek (6:00 AM - 9:00 AM)',
    openingHours: '5:00 AM - 7:00 PM daily',
    typicalPeakHours: '10:00 AM - 4:00 PM weekends',
    image: '/src/assets/images/dest_shaniwar_wada_1794061944263.jpg',
  }
];

// Helper to create timestamp relative to right now in minutes
const relativeMinutesAgo = (minutes: number) => {
  return new Date(Date.now() - minutes * 60 * 1000).toISOString();
};

export const INITIAL_DEMO_REPORTS: CrowdReport[] = [
  // Gateway of India: High Crowd
  {
    reportId: 'rep_gw_1',
    userId: 'user_aarav_m',
    userName: 'Aarav Mehta',
    destinationId: 'dest_gateway_mumbai',
    crowdLevel: 'HIGH',
    timestamp: relativeMinutesAgo(18),
    isGpsVerified: true,
    userDistanceMeters: 45,
    isDemo: true,
    notes: 'Long queues at the security check. Jetty ferry boarding line stretches past the monument.',
    estimatedWaitMinutes: 35
  },
  {
    reportId: 'rep_gw_2',
    userId: 'user_priya_k',
    userName: 'Priya Kulkarni',
    destinationId: 'dest_gateway_mumbai',
    crowdLevel: 'HIGH',
    timestamp: relativeMinutesAgo(42),
    isGpsVerified: true,
    userDistanceMeters: 110,
    isDemo: true,
    notes: 'Very packed today with tour groups and photographers.',
    estimatedWaitMinutes: 40
  },
  {
    reportId: 'rep_gw_3',
    userId: 'user_rohit_s',
    userName: 'Rohit Sharma',
    destinationId: 'dest_gateway_mumbai',
    crowdLevel: 'HIGH',
    timestamp: relativeMinutesAgo(75),
    isGpsVerified: false,
    userDistanceMeters: 1800,
    isDemo: true,
    notes: 'Parking near Taj Hotel full.',
    estimatedWaitMinutes: 30
  },
  {
    reportId: 'rep_gw_4',
    userId: 'user_tanvi_p',
    userName: 'Tanvi Patil',
    destinationId: 'dest_gateway_mumbai',
    crowdLevel: 'MODERATE',
    timestamp: relativeMinutesAgo(110),
    isGpsVerified: true,
    userDistanceMeters: 60,
    isDemo: true,
    estimatedWaitMinutes: 20
  },

  // Marine Drive: Moderate Crowd
  {
    reportId: 'rep_md_1',
    userId: 'user_vikram_r',
    userName: 'Vikram Rao',
    destinationId: 'dest_marine_drive',
    crowdLevel: 'MODERATE',
    timestamp: relativeMinutesAgo(25),
    isGpsVerified: true,
    userDistanceMeters: 30,
    isDemo: true,
    notes: 'Decent evening breeze. Walking promenade is moving smoothly with light pedestrian density.',
    estimatedWaitMinutes: 5
  },
  {
    reportId: 'rep_md_2',
    userId: 'user_ananya_d',
    userName: 'Ananya Deshmukh',
    destinationId: 'dest_marine_drive',
    crowdLevel: 'MODERATE',
    timestamp: relativeMinutesAgo(60),
    isGpsVerified: true,
    userDistanceMeters: 90,
    isDemo: true,
    notes: 'Seating along tetrapods has spots open.',
    estimatedWaitMinutes: 10
  },
  {
    reportId: 'rep_md_3',
    userId: 'user_samir_j',
    userName: 'Samir Joshi',
    destinationId: 'dest_marine_drive',
    crowdLevel: 'LOW',
    timestamp: relativeMinutesAgo(140),
    isGpsVerified: true,
    userDistanceMeters: 15,
    isDemo: true,
    estimatedWaitMinutes: 0
  },

  // Shaniwar Wada: Low Crowd
  {
    reportId: 'rep_sw_1',
    userId: 'user_neha_g',
    userName: 'Neha Godbole',
    destinationId: 'dest_shaniwar_wada',
    crowdLevel: 'LOW',
    timestamp: relativeMinutesAgo(35),
    isGpsVerified: true,
    userDistanceMeters: 20,
    isDemo: true,
    notes: 'Very pleasant, no line at the ticket counter. Courtyards are quiet.',
    estimatedWaitMinutes: 5
  },
  {
    reportId: 'rep_sw_2',
    userId: 'user_aditya_c',
    userName: 'Aditya Chavan',
    destinationId: 'dest_shaniwar_wada',
    crowdLevel: 'LOW',
    timestamp: relativeMinutesAgo(80),
    isGpsVerified: true,
    userDistanceMeters: 55,
    isDemo: true,
    notes: 'Clean grounds, almost no wait for entry.',
    estimatedWaitMinutes: 5
  },

  // Aga Khan Palace: Low Crowd
  {
    reportId: 'rep_ak_1',
    userId: 'user_kiran_w',
    userName: 'Kiran Wagh',
    destinationId: 'dest_aga_khan_palace',
    crowdLevel: 'LOW',
    timestamp: relativeMinutesAgo(50),
    isGpsVerified: true,
    userDistanceMeters: 40,
    isDemo: true,
    notes: 'Peaceful memorial gardens. Great time for a serene walk.',
    estimatedWaitMinutes: 0
  },
  {
    reportId: 'rep_ak_2',
    userId: 'user_pooja_m',
    userName: 'Pooja More',
    destinationId: 'dest_aga_khan_palace',
    crowdLevel: 'LOW',
    timestamp: relativeMinutesAgo(120),
    isGpsVerified: true,
    userDistanceMeters: 15,
    isDemo: true,
    notes: 'Very few people inside the museum wing.',
    estimatedWaitMinutes: 0
  },

  // Ajanta Caves: Moderate Crowd
  {
    reportId: 'rep_aj_1',
    userId: 'user_rahul_b',
    userName: 'Rahul Bhave',
    destinationId: 'dest_ajanta_caves',
    crowdLevel: 'MODERATE',
    timestamp: relativeMinutesAgo(40),
    isGpsVerified: true,
    userDistanceMeters: 80,
    isDemo: true,
    notes: 'Shuttle bus has about 15 minutes queue. Cave 1 and 2 have moderate flow.',
    estimatedWaitMinutes: 20
  },
  {
    reportId: 'rep_aj_2',
    userId: 'user_deepak_t',
    userName: 'Deepak Tiwari',
    destinationId: 'dest_ajanta_caves',
    crowdLevel: 'MODERATE',
    timestamp: relativeMinutesAgo(90),
    isGpsVerified: true,
    userDistanceMeters: 120,
    isDemo: true,
    notes: 'Ticketing fast, cave interiors moderately populated.',
    estimatedWaitMinutes: 15
  },

  // Lonavala Tiger Point: High Crowd
  {
    reportId: 'rep_ln_1',
    userId: 'user_siddharth_k',
    userName: 'Siddharth Kelkar',
    destinationId: 'dest_lonavala_tiger_point',
    crowdLevel: 'HIGH',
    timestamp: relativeMinutesAgo(15),
    isGpsVerified: true,
    userDistanceMeters: 25,
    isDemo: true,
    notes: 'Road jammed on ghat incline! Heavy tourist rush for corn stalls and viewpoint.',
    estimatedWaitMinutes: 45
  },
  {
    reportId: 'rep_ln_2',
    userId: 'user_meera_s',
    userName: 'Meera Shinde',
    destinationId: 'dest_lonavala_tiger_point',
    crowdLevel: 'HIGH',
    timestamp: relativeMinutesAgo(45),
    isGpsVerified: true,
    userDistanceMeters: 60,
    isDemo: true,
    notes: 'Heavy vehicle crowding at parking zone.',
    estimatedWaitMinutes: 40
  }
  // Note: Ellora Caves & Sinhagad Fort intentionally have few or no recent reports to demonstrate the "INSUFFICIENT DATA / GREY" crowd level state!
];

export const INITIAL_USERS: User[] = [
  {
    userId: 'user_aarav_m',
    name: 'Aarav Mehta',
    email: 'aarav.m@example.com',
    role: 'local_guide',
    rewardPoints: 240,
    acceptedReports: 11,
    createdAt: '2026-08-14T10:00:00.000Z'
  },
  {
    userId: 'user_priya_k',
    name: 'Priya Kulkarni',
    email: 'priya.k@example.com',
    role: 'local_guide',
    rewardPoints: 185,
    acceptedReports: 8,
    createdAt: '2026-09-02T14:30:00.000Z'
  },
  {
    userId: 'user_vikram_r',
    name: 'Vikram Rao',
    email: 'vikram.r@example.com',
    role: 'tourist',
    rewardPoints: 140,
    acceptedReports: 6,
    createdAt: '2026-09-20T08:15:00.000Z'
  },
  {
    userId: 'user_neha_g',
    name: 'Neha Godbole',
    email: 'neha.g@example.com',
    role: 'tourist',
    rewardPoints: 95,
    acceptedReports: 4,
    createdAt: '2026-10-05T12:00:00.000Z'
  },
  {
    userId: 'user_rahul_b',
    name: 'Rahul Bhave',
    email: 'rahul.b@example.com',
    role: 'tourist',
    rewardPoints: 75,
    acceptedReports: 3,
    createdAt: '2026-10-18T16:45:00.000Z'
  }
];

export const DEFAULT_CURRENT_USER: User = {
  userId: 'user_guest_judge',
  name: 'Demo Judge',
  email: 'judge@hackathon.org',
  role: 'tourist',
  rewardPoints: 35,
  acceptedReports: 1,
  createdAt: '2026-11-01T09:00:00.000Z',
  isGuest: true
};
