import type { RequestStatus, RequestUrgency } from '@/components/dashboard/status-badge';

export const residentProfile = {
  firstName: 'Njeri',
  lastName: 'Kamau',
  email: 'njeri.kamau@example.com',
  unit: 'Unit 4B',
  building: 'Kilimani Heights',
  neighborhood: 'Kilimani, Nairobi',
  memberSince: 'March 2024',
  initials: 'NK',
};

export interface MaintenanceRequestSummary {
  id: string;
  title: string;
  category: string;
  urgency: RequestUrgency;
  status: RequestStatus;
  createdAt: string;
  technician?: { name: string; image: string };
  scheduledFor?: string;
}

export const maintenanceRequests: MaintenanceRequestSummary[] = [
  {
    id: 'MR-1042',
    title: 'Kitchen sink pipe leaking under cabinet',
    category: 'Plumbing',
    urgency: 'HIGH',
    status: 'IN_PROGRESS',
    createdAt: '2026-08-12',
    technician: {
      name: 'Grace Wanjiru',
      image: 'https://images.unsplash.com/photo-1563132337-f159f484226c?q=80&w=200&auto=format&fit=crop',
    },
    scheduledFor: 'Today, 2:00 PM',
  },
  {
    id: 'MR-1038',
    title: 'Living room light switch not working',
    category: 'Electrical',
    urgency: 'MEDIUM',
    status: 'ASSIGNED',
    createdAt: '2026-08-10',
    technician: {
      name: 'Brian Mutiso',
      image: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?q=80&w=200&auto=format&fit=crop',
    },
    scheduledFor: 'Tomorrow, 10:00 AM',
  },
  {
    id: 'MR-1029',
    title: 'Bedroom door hinge squeaking and misaligned',
    category: 'Carpentry',
    urgency: 'LOW',
    status: 'COMPLETED',
    createdAt: '2026-08-02',
    technician: {
      name: 'Peter Otieno',
      image: 'https://images.unsplash.com/photo-1687422810663-c316494f725a?q=80&w=200&auto=format&fit=crop',
    },
  },
  {
    id: 'MR-1015',
    title: 'AC unit not cooling in main bedroom',
    category: 'HVAC',
    urgency: 'MEDIUM',
    status: 'COMPLETED',
    createdAt: '2026-07-24',
    technician: {
      name: 'Samuel Kiptoo',
      image: 'https://images.unsplash.com/photo-1688841747582-41097036109d?q=80&w=200&auto=format&fit=crop',
    },
  },
];

export interface Transaction {
  id: string;
  label: string;
  type: 'DEPOSIT' | 'SERVICE_CHARGE' | 'MAINTENANCE_ESCROW' | 'REFUND';
  amount: number;
  date: string;
  status: 'PENDING' | 'SUCCESSFUL' | 'FAILED';
}

export const walletSummary = {
  balance: 8400,
  currency: 'KES',
  escrowHeld: 3500,
};

export const transactions: Transaction[] = [
  { id: 'TXN-9231', label: 'Wallet top-up via M-Pesa', type: 'DEPOSIT', amount: 5000, date: '2026-08-13', status: 'SUCCESSFUL' },
  { id: 'TXN-9218', label: 'Escrow hold — Kitchen sink repair', type: 'MAINTENANCE_ESCROW', amount: -3500, date: '2026-08-12', status: 'PENDING' },
  { id: 'TXN-9190', label: 'Building service charge — August', type: 'SERVICE_CHARGE', amount: -2500, date: '2026-08-01', status: 'SUCCESSFUL' },
  { id: 'TXN-9142', label: 'Wallet top-up via Stripe', type: 'DEPOSIT', amount: 6000, date: '2026-07-22', status: 'SUCCESSFUL' },
  { id: 'TXN-9098', label: 'Refund — Cancelled painting job', type: 'REFUND', amount: 1800, date: '2026-07-15', status: 'SUCCESSFUL' },
];

export interface Notice {
  id: string;
  title: string;
  body: string;
  date: string;
  category: 'Maintenance' | 'Security' | 'Community' | 'Billing';
}

export const notices: Notice[] = [
  {
    id: 'N-1',
    title: 'Scheduled water shutdown — Aug 18',
    body: 'Nairobi Water will be doing mains repair work on Argwings Kodhek Rd. Expect no water supply from 9:00 AM to 4:00 PM. Please store water in advance.',
    date: '2026-08-14',
    category: 'Maintenance',
  },
  {
    id: 'N-2',
    title: 'Annual General Meeting — Aug 30',
    body: 'All residents are invited to the AGM in the ground-floor community hall at 6:00 PM to review the 2026 building budget and elect committee members.',
    date: '2026-08-11',
    category: 'Community',
  },
  {
    id: 'N-3',
    title: 'New night security guard on duty',
    body: 'Please welcome Josephat Mwangi, our new night-shift guard, on duty from 7:00 PM to 6:00 AM starting this week.',
    date: '2026-08-09',
    category: 'Security',
  },
];
