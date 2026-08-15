import type { RequestUrgency } from '@/components/dashboard/status-badge';

export const technicianProfile = {
  firstName: 'Grace',
  lastName: 'Wanjiru',
  initials: 'GW',
  email: 'grace.wanjiru@example.com',
  category: 'Plumbing',
  bio: 'Licensed plumber with 10 years fixing leaks, installing piping, and servicing boreholes across Nairobi\'s westside estates.',
  experienceYears: 10,
  averageRating: 4.8,
  reviewCount: 96,
  jobsCompleted: 210,
  hourlyRate: 1200,
  location: 'Kileleshwa & Kilimani',
  image: 'https://images.unsplash.com/photo-1563132337-f159f484226c?q=80&w=400&auto=format&fit=crop',
  isAvailable: true,
  memberSince: 'June 2019',
  skills: ['Pipe Installation', 'Leak Detection', 'Drainage Systems', 'Water Heater Repair', 'Borehole Pumps'],
  certifications: ['National ID Verified', 'NITA Plumbing Trade Test — Grade II', 'Certificate of Good Conduct (DCI)'],
};

export type BookingStatus = 'PROPOSED' | 'ACCEPTED' | 'IN_ROUTE' | 'WORK_STARTED' | 'COMPLETED' | 'CANCELLED';

export interface TechBooking {
  id: string;
  title: string;
  category: string;
  urgency: RequestUrgency;
  status: BookingStatus;
  resident: string;
  unit: string;
  building: string;
  neighborhood: string;
  scheduledFor: string;
  totalAmount: number;
}

export const bookings: TechBooking[] = [
  {
    id: 'BK-3301',
    title: 'Kitchen sink pipe leaking under cabinet',
    category: 'Plumbing',
    urgency: 'HIGH',
    status: 'WORK_STARTED',
    resident: 'Njeri Kamau',
    unit: '4B',
    building: 'Kilimani Heights',
    neighborhood: 'Kilimani',
    scheduledFor: 'Today, 2:00 PM',
    totalAmount: 4500,
  },
  {
    id: 'BK-3298',
    title: 'New booking request — bathroom shower valve replacement',
    category: 'Plumbing',
    urgency: 'MEDIUM',
    status: 'PROPOSED',
    resident: 'Faith Njoroge',
    unit: 'A1',
    building: 'Kilimani Heights',
    neighborhood: 'Kilimani',
    scheduledFor: 'Awaiting your response',
    totalAmount: 3200,
  },
  {
    id: 'BK-3295',
    title: 'Borehole pump making unusual noise',
    category: 'Plumbing',
    urgency: 'MEDIUM',
    status: 'ACCEPTED',
    resident: 'Daniel Kariuki',
    unit: 'D2',
    building: 'Greenview Court',
    neighborhood: 'Westlands',
    scheduledFor: 'Tomorrow, 9:00 AM',
    totalAmount: 3800,
  },
  {
    id: 'BK-3290',
    title: 'Drainage backing up in kitchen',
    category: 'Plumbing',
    urgency: 'HIGH',
    status: 'IN_ROUTE',
    resident: 'Esther Nyambura',
    unit: 'C4',
    building: 'Kilimani Heights',
    neighborhood: 'Kilimani',
    scheduledFor: 'Today, 4:30 PM',
    totalAmount: 2800,
  },
  {
    id: 'BK-3271',
    title: 'Water heater not warming up',
    category: 'Plumbing',
    urgency: 'MEDIUM',
    status: 'COMPLETED',
    resident: 'Ann Wambui',
    unit: 'A5',
    building: 'Kilimani Heights',
    neighborhood: 'Kilimani',
    scheduledFor: '2026-08-08',
    totalAmount: 5200,
  },
  {
    id: 'BK-3260',
    title: 'Toilet cistern replacement',
    category: 'Plumbing',
    urgency: 'LOW',
    status: 'COMPLETED',
    resident: 'Michael Ndung’u',
    unit: 'B3',
    building: 'Kilimani Heights',
    neighborhood: 'Kilimani',
    scheduledFor: '2026-08-03',
    totalAmount: 3600,
  },
  {
    id: 'BK-3244',
    title: 'Outdoor tap and hose bib repair',
    category: 'Plumbing',
    urgency: 'LOW',
    status: 'CANCELLED',
    resident: 'Peter Kigen',
    unit: 'E1',
    building: 'Riverside Apartments',
    neighborhood: 'Lavington',
    scheduledFor: '2026-07-27',
    totalAmount: 1800,
  },
];

export interface AvailableJob {
  id: string;
  title: string;
  description: string;
  category: string;
  urgency: RequestUrgency;
  building: string;
  neighborhood: string;
  distanceKm: number;
  estimatedPayout: number;
  postedAt: string;
}

export const availableJobs: AvailableJob[] = [
  {
    id: 'MR-1040',
    title: 'Bathroom ceiling damp patch spreading',
    description: 'Damp patch above the shower has grown over the past week — likely a slow leak in the wall cavity or the unit above.',
    category: 'Plumbing',
    urgency: 'MEDIUM',
    building: 'Kilimani Heights, Block B',
    neighborhood: 'Kilimani',
    distanceKm: 0.4,
    estimatedPayout: 3800,
    postedAt: '2026-08-14',
  },
  {
    id: 'MR-2118',
    title: 'Kitchen mixer tap dripping constantly',
    description: 'Mixer tap drips even when fully closed — likely a worn cartridge. Resident has already tried tightening the handle.',
    category: 'Plumbing',
    urgency: 'LOW',
    building: 'Greenview Court',
    neighborhood: 'Westlands',
    distanceKm: 3.2,
    estimatedPayout: 2200,
    postedAt: '2026-08-14',
  },
  {
    id: 'MR-2115',
    title: 'Burst pipe under bathroom floor tiles',
    description: 'Water pooling near the bathroom door for two days. Suspected burst pipe beneath the tiles — needs urgent inspection.',
    category: 'Plumbing',
    urgency: 'CRITICAL',
    building: 'Riverside Apartments',
    neighborhood: 'Lavington',
    distanceKm: 4.6,
    estimatedPayout: 6500,
    postedAt: '2026-08-13',
  },
  {
    id: 'MR-2109',
    title: 'Low water pressure across whole unit',
    description: 'Water pressure has been dropping steadily for two weeks — could be a blocked inlet valve or mains issue.',
    category: 'Plumbing',
    urgency: 'MEDIUM',
    building: 'Parkview Residences',
    neighborhood: 'Kileleshwa',
    distanceKm: 2.1,
    estimatedPayout: 3000,
    postedAt: '2026-08-12',
  },
  {
    id: 'MR-2101',
    title: 'Installing new washing machine plumbing',
    description: 'Resident just purchased a washing machine and needs inlet/outlet plumbing fitted in the utility area.',
    category: 'Plumbing',
    urgency: 'LOW',
    building: 'Kilimani Heights, Block C',
    neighborhood: 'Kilimani',
    distanceKm: 0.4,
    estimatedPayout: 4200,
    postedAt: '2026-08-11',
  },
];

export const earningsSummary = {
  availableBalance: 34500,
  pendingPayout: 18500,
  totalEarnedThisMonth: 62800,
  totalEarnedAllTime: 1486200,
  currency: 'KES',
};

export interface EarningsTransaction {
  id: string;
  label: string;
  type: 'PAYOUT' | 'COMMISSION_FEE' | 'WITHDRAWAL';
  amount: number;
  date: string;
  status: 'PENDING' | 'SUCCESSFUL' | 'FAILED';
}

export const earningsTransactions: EarningsTransaction[] = [
  { id: 'TXN-8819', label: 'Job payout — Kitchen sink pipe leaking (BK-3301)', type: 'PAYOUT', amount: 4500, date: '2026-08-14', status: 'PENDING' },
  { id: 'TXN-8760', label: 'Platform commission — 10%', type: 'COMMISSION_FEE', amount: -520, date: '2026-08-08', status: 'SUCCESSFUL' },
  { id: 'TXN-8759', label: 'Job payout — Water heater not warming up (BK-3271)', type: 'PAYOUT', amount: 5200, date: '2026-08-08', status: 'SUCCESSFUL' },
  { id: 'TXN-8741', label: 'Withdrawal to M-Pesa — 0712 334 551', type: 'WITHDRAWAL', amount: -20000, date: '2026-08-05', status: 'SUCCESSFUL' },
  { id: 'TXN-8712', label: 'Job payout — Toilet cistern replacement (BK-3260)', type: 'PAYOUT', amount: 3600, date: '2026-08-03', status: 'SUCCESSFUL' },
];

export interface TechReview {
  id: string;
  resident: string;
  unit: string;
  rating: number;
  qualityRating: number;
  speedRating: number;
  professionalismRating: number;
  comment: string;
  date: string;
}

export const reviews: TechReview[] = [
  {
    id: 'RV-401',
    resident: 'Ann Wambui',
    unit: 'A5, Kilimani Heights',
    rating: 5,
    qualityRating: 5,
    speedRating: 5,
    professionalismRating: 5,
    comment: 'Grace fixed the water heater in under an hour and left the bathroom cleaner than she found it. Highly recommend.',
    date: '2026-08-08',
  },
  {
    id: 'RV-398',
    resident: 'Michael Ndung’u',
    unit: 'B3, Kilimani Heights',
    rating: 5,
    qualityRating: 5,
    speedRating: 4,
    professionalismRating: 5,
    comment: 'Very professional, explained exactly what was wrong with the cistern before starting. Fair pricing too.',
    date: '2026-08-03',
  },
  {
    id: 'RV-389',
    resident: 'Njeri Kamau',
    unit: '4B, Kilimani Heights',
    rating: 4,
    qualityRating: 5,
    speedRating: 4,
    professionalismRating: 4,
    comment: 'Good work overall, took a little longer than quoted but the leak is fully fixed now.',
    date: '2026-07-19',
  },
  {
    id: 'RV-375',
    resident: 'Peter Kigen',
    unit: 'E1, Riverside Apartments',
    rating: 5,
    qualityRating: 5,
    speedRating: 5,
    professionalismRating: 5,
    comment: 'Arrived on time and diagnosed the borehole pump issue immediately. Will book again.',
    date: '2026-07-02',
  },
];
