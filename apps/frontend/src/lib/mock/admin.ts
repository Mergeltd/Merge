import type { RequestStatus, RequestUrgency } from '@/components/dashboard/status-badge';

export const adminProfile = {
  firstName: 'Daniel',
  lastName: 'Mwendwa',
  email: 'daniel.mwendwa@merge.app',
  role: 'Apartment Admin',
  apartment: 'Kilimani Heights',
  neighborhood: 'Kilimani, Nairobi',
  memberSince: 'January 2023',
  initials: 'DM',
};

export type UnitStatus = 'VACANT' | 'OCCUPIED' | 'MAINTENANCE';

export interface AdminUnit {
  id: string;
  number: string;
  building: string;
  floor: number;
  status: UnitStatus;
  rentAmount: number;
  resident?: string;
}

export const buildings = [
  { id: 'B-A', name: 'Block A', units: 8, occupied: 7 },
  { id: 'B-B', name: 'Block B', units: 8, occupied: 6 },
  { id: 'B-C', name: 'Block C', units: 8, occupied: 6 },
];

export const units: AdminUnit[] = [
  { id: 'U-A1', number: 'A1', building: 'Block A', floor: 1, status: 'OCCUPIED', rentAmount: 42000, resident: 'Faith Njoroge' },
  { id: 'U-A2', number: 'A2', building: 'Block A', floor: 1, status: 'OCCUPIED', rentAmount: 42000, resident: 'Kevin Omondi' },
  { id: 'U-A3', number: 'A3', building: 'Block A', floor: 2, status: 'VACANT', rentAmount: 45000 },
  { id: 'U-A4', number: '4B', building: 'Block A', floor: 4, status: 'OCCUPIED', rentAmount: 48000, resident: 'Njeri Kamau' },
  { id: 'U-A5', number: 'A5', building: 'Block A', floor: 4, status: 'OCCUPIED', rentAmount: 48000, resident: 'Ann Wambui' },
  { id: 'U-A6', number: 'A6', building: 'Block A', floor: 5, status: 'MAINTENANCE', rentAmount: 50000, resident: 'David Mwangi' },
  { id: 'U-A7', number: 'A7', building: 'Block A', floor: 6, status: 'OCCUPIED', rentAmount: 50000, resident: 'Sarah Chebet' },
  { id: 'U-A8', number: 'A8', building: 'Block A', floor: 6, status: 'OCCUPIED', rentAmount: 50000, resident: 'James Kariuki' },
  { id: 'U-B1', number: 'B1', building: 'Block B', floor: 1, status: 'OCCUPIED', rentAmount: 38000, resident: 'Lucy Atieno' },
  { id: 'U-B2', number: 'B2', building: 'Block B', floor: 1, status: 'VACANT', rentAmount: 38000 },
  { id: 'U-B3', number: 'B3', building: 'Block B', floor: 2, status: 'OCCUPIED', rentAmount: 40000, resident: 'Michael Ndung’u' },
  { id: 'U-B4', number: 'B4', building: 'Block B', floor: 3, status: 'MAINTENANCE', rentAmount: 40000, resident: 'Beatrice Wairimu' },
  { id: 'U-B5', number: 'B5', building: 'Block B', floor: 3, status: 'OCCUPIED', rentAmount: 40000, resident: 'Collins Barasa' },
  { id: 'U-B6', number: 'B6', building: 'Block B', floor: 4, status: 'OCCUPIED', rentAmount: 42000, resident: 'Diana Wangari' },
  { id: 'U-B7', number: 'B7', building: 'Block B', floor: 5, status: 'VACANT', rentAmount: 42000 },
  { id: 'U-B8', number: 'B8', building: 'Block B', floor: 5, status: 'OCCUPIED', rentAmount: 42000, resident: 'Patrick Kiplangat' },
  { id: 'U-C1', number: 'C1', building: 'Block C', floor: 1, status: 'OCCUPIED', rentAmount: 55000, resident: 'Grace Muthoni' },
  { id: 'U-C2', number: 'C2', building: 'Block C', floor: 2, status: 'OCCUPIED', rentAmount: 55000, resident: 'Brian Owino' },
  { id: 'U-C3', number: 'C3', building: 'Block C', floor: 2, status: 'VACANT', rentAmount: 58000 },
  { id: 'U-C4', number: 'C4', building: 'Block C', floor: 3, status: 'OCCUPIED', rentAmount: 58000, resident: 'Esther Nyambura' },
  { id: 'U-C5', number: 'C5', building: 'Block C', floor: 4, status: 'OCCUPIED', rentAmount: 60000, resident: 'Victor Kimani' },
  { id: 'U-C6', number: 'C6', building: 'Block C', floor: 4, status: 'MAINTENANCE', rentAmount: 60000, resident: 'Winnie Adhiambo' },
  { id: 'U-C7', number: 'C7', building: 'Block C', floor: 5, status: 'VACANT', rentAmount: 62000 },
  { id: 'U-C8', number: 'C8', building: 'Block C', floor: 5, status: 'OCCUPIED', rentAmount: 62000, resident: 'Tom Odhiambo' },
];

export interface AdminResident {
  id: string;
  name: string;
  initials: string;
  unit: string;
  building: string;
  email: string;
  phone: string;
  leaseStart: string;
  leaseEnd: string;
  status: 'ACTIVE' | 'PENDING' | 'ARREARS';
}

export const residents: AdminResident[] = [
  { id: 'R-1', name: 'Njeri Kamau', initials: 'NK', unit: '4B', building: 'Block A', email: 'njeri.kamau@example.com', phone: '+254 712 334 551', leaseStart: 'Mar 2024', leaseEnd: 'Feb 2027', status: 'ACTIVE' },
  { id: 'R-2', name: 'Faith Njoroge', initials: 'FN', unit: 'A1', building: 'Block A', email: 'faith.njoroge@example.com', phone: '+254 720 118 402', leaseStart: 'Jun 2023', leaseEnd: 'May 2026', status: 'ACTIVE' },
  { id: 'R-3', name: 'Kevin Omondi', initials: 'KO', unit: 'A2', building: 'Block A', email: 'kevin.omondi@example.com', phone: '+254 733 902 771', leaseStart: 'Jan 2025', leaseEnd: 'Dec 2026', status: 'ARREARS' },
  { id: 'R-4', name: 'Ann Wambui', initials: 'AW', unit: 'A5', building: 'Block A', email: 'ann.wambui@example.com', phone: '+254 708 664 213', leaseStart: 'Sep 2022', leaseEnd: 'Aug 2026', status: 'ACTIVE' },
  { id: 'R-5', name: 'David Mwangi', initials: 'DM', unit: 'A6', building: 'Block A', email: 'david.mwangi@example.com', phone: '+254 715 220 887', leaseStart: 'Apr 2024', leaseEnd: 'Mar 2027', status: 'ACTIVE' },
  { id: 'R-6', name: 'Sarah Chebet', initials: 'SC', unit: 'A7', building: 'Block A', email: 'sarah.chebet@example.com', phone: '+254 722 449 016', leaseStart: 'Jul 2023', leaseEnd: 'Jun 2026', status: 'ACTIVE' },
  { id: 'R-7', name: 'Lucy Atieno', initials: 'LA', unit: 'B1', building: 'Block B', email: 'lucy.atieno@example.com', phone: '+254 701 556 340', leaseStart: 'Feb 2025', leaseEnd: 'Jan 2027', status: 'PENDING' },
  { id: 'R-8', name: 'Michael Ndung’u', initials: 'MN', unit: 'B3', building: 'Block B', email: 'michael.ndungu@example.com', phone: '+254 719 887 023', leaseStart: 'Nov 2023', leaseEnd: 'Oct 2026', status: 'ACTIVE' },
  { id: 'R-9', name: 'Beatrice Wairimu', initials: 'BW', unit: 'B4', building: 'Block B', email: 'beatrice.wairimu@example.com', phone: '+254 727 331 908', leaseStart: 'May 2024', leaseEnd: 'Apr 2027', status: 'ARREARS' },
  { id: 'R-10', name: 'Grace Muthoni', initials: 'GM', unit: 'C1', building: 'Block C', email: 'grace.muthoni@example.com', phone: '+254 733 118 645', leaseStart: 'Aug 2022', leaseEnd: 'Jul 2026', status: 'ACTIVE' },
  { id: 'R-11', name: 'Victor Kimani', initials: 'VK', unit: 'C5', building: 'Block C', email: 'victor.kimani@example.com', phone: '+254 712 990 214', leaseStart: 'Oct 2024', leaseEnd: 'Sep 2027', status: 'ACTIVE' },
  { id: 'R-12', name: 'Winnie Adhiambo', initials: 'WA', unit: 'C6', building: 'Block C', email: 'winnie.adhiambo@example.com', phone: '+254 700 445 128', leaseStart: 'Jan 2024', leaseEnd: 'Dec 2026', status: 'ACTIVE' },
];

export type TechVerificationStatus = 'VERIFIED' | 'PENDING_VERIFICATION' | 'SUSPENDED';

export interface AdminTechnician {
  id: string;
  name: string;
  category: string;
  image?: string;
  initials?: string;
  verificationStatus: TechVerificationStatus;
  averageRating: number;
  jobsCompleted: number;
  submittedAt?: string;
}

export const technicians: AdminTechnician[] = [
  { id: 'T-1', name: 'Grace Wanjiru', category: 'Plumbing', image: 'https://images.unsplash.com/photo-1563132337-f159f484226c?q=80&w=200&auto=format&fit=crop', verificationStatus: 'VERIFIED', averageRating: 4.8, jobsCompleted: 210 },
  { id: 'T-2', name: 'Brian Mutiso', category: 'Electrical', image: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?q=80&w=200&auto=format&fit=crop', verificationStatus: 'VERIFIED', averageRating: 4.9, jobsCompleted: 260 },
  { id: 'T-3', name: 'Peter Otieno', category: 'Carpentry', image: 'https://images.unsplash.com/photo-1687422810663-c316494f725a?q=80&w=200&auto=format&fit=crop', verificationStatus: 'VERIFIED', averageRating: 4.7, jobsCompleted: 150 },
  { id: 'T-4', name: 'Dennis Kamau', category: 'Painting', image: 'https://images.unsplash.com/photo-1779971685817-77e596abd71a?q=80&w=200&auto=format&fit=crop', verificationStatus: 'VERIFIED', averageRating: 4.9, jobsCompleted: 120 },
  { id: 'T-5', name: 'Samuel Kiptoo', category: 'HVAC', image: 'https://images.unsplash.com/photo-1688841747582-41097036109d?q=80&w=200&auto=format&fit=crop', verificationStatus: 'VERIFIED', averageRating: 4.6, jobsCompleted: 140 },
  { id: 'T-6', name: 'Mary Achieng', category: 'Electrical', image: 'https://images.unsplash.com/photo-1632612721400-0a337458b7ed?q=80&w=200&auto=format&fit=crop', verificationStatus: 'VERIFIED', averageRating: 5.0, jobsCompleted: 310 },
  { id: 'T-7', name: 'Joseph Mutua', category: 'Plumbing', initials: 'JM', verificationStatus: 'PENDING_VERIFICATION', averageRating: 0, jobsCompleted: 0, submittedAt: '2026-08-13' },
  { id: 'T-8', name: 'Cynthia Njeri', category: 'Painting', initials: 'CN', verificationStatus: 'PENDING_VERIFICATION', averageRating: 0, jobsCompleted: 0, submittedAt: '2026-08-11' },
];

export interface AdminMaintenanceRequest {
  id: string;
  title: string;
  category: string;
  urgency: RequestUrgency;
  status: RequestStatus;
  unit: string;
  building: string;
  resident: string;
  createdAt: string;
  technician?: string;
}

export const maintenanceRequests: AdminMaintenanceRequest[] = [
  { id: 'MR-1042', title: 'Kitchen sink pipe leaking under cabinet', category: 'Plumbing', urgency: 'HIGH', status: 'IN_PROGRESS', unit: '4B', building: 'Block A', resident: 'Njeri Kamau', createdAt: '2026-08-12', technician: 'Grace Wanjiru' },
  { id: 'MR-1041', title: 'Circuit breaker tripping repeatedly', category: 'Electrical', urgency: 'CRITICAL', status: 'ASSIGNED', unit: 'A6', building: 'Block A', resident: 'David Mwangi', createdAt: '2026-08-13', technician: 'Brian Mutiso' },
  { id: 'MR-1040', title: 'Bathroom ceiling damp patch spreading', category: 'Plumbing', urgency: 'MEDIUM', status: 'OPEN', unit: 'B4', building: 'Block B', resident: 'Beatrice Wairimu', createdAt: '2026-08-14' },
  { id: 'MR-1039', title: 'Front door lock jamming', category: 'Carpentry', urgency: 'LOW', status: 'OPEN', unit: 'C6', building: 'Block C', resident: 'Winnie Adhiambo', createdAt: '2026-08-14' },
  { id: 'MR-1038', title: 'Living room light switch not working', category: 'Electrical', urgency: 'MEDIUM', status: 'ASSIGNED', unit: '4B', building: 'Block A', resident: 'Njeri Kamau', createdAt: '2026-08-10', technician: 'Brian Mutiso' },
  { id: 'MR-1035', title: 'Water heater not warming up', category: 'HVAC', urgency: 'MEDIUM', status: 'IN_PROGRESS', unit: 'A6', building: 'Block A', resident: 'David Mwangi', createdAt: '2026-08-09', technician: 'Samuel Kiptoo' },
  { id: 'MR-1031', title: 'Peeling paint on hallway ceiling', category: 'Painting', urgency: 'LOW', status: 'COMPLETED', unit: 'C1', building: 'Block C', resident: 'Grace Muthoni', createdAt: '2026-08-04', technician: 'Dennis Kamau' },
  { id: 'MR-1029', title: 'Bedroom door hinge squeaking and misaligned', category: 'Carpentry', urgency: 'LOW', status: 'COMPLETED', unit: '4B', building: 'Block A', resident: 'Njeri Kamau', createdAt: '2026-08-02', technician: 'Peter Otieno' },
  { id: 'MR-1024', title: 'Fuse box smell of burning', category: 'Electrical', urgency: 'CRITICAL', status: 'COMPLETED', unit: 'B1', building: 'Block B', resident: 'Lucy Atieno', createdAt: '2026-07-29', technician: 'Mary Achieng' },
  { id: 'MR-1015', title: 'AC unit not cooling in main bedroom', category: 'HVAC', urgency: 'MEDIUM', status: 'COMPLETED', unit: '4B', building: 'Block A', resident: 'Njeri Kamau', createdAt: '2026-07-24', technician: 'Samuel Kiptoo' },
];

export const revenueByMonth = [
  { month: 'Mar', revenue: 1620000 },
  { month: 'Apr', revenue: 1685000 },
  { month: 'May', revenue: 1710000 },
  { month: 'Jun', revenue: 1760000 },
  { month: 'Jul', revenue: 1840000 },
  { month: 'Aug', revenue: 1902000 },
];

export interface AdminTransaction {
  id: string;
  label: string;
  type: 'RENT' | 'SERVICE_CHARGE' | 'PAYOUT' | 'ESCROW' | 'REFUND';
  amount: number;
  date: string;
  status: 'PENDING' | 'SUCCESSFUL' | 'FAILED';
}

export const financeSummary = {
  monthlyRevenue: 1902000,
  escrowHeld: 186500,
  pendingPayouts: 94000,
  arrears: 88000,
  currency: 'KES',
};

export const transactions: AdminTransaction[] = [
  { id: 'TXN-8821', label: 'Rent payment — Unit A1 (Faith Njoroge)', type: 'RENT', amount: 42000, date: '2026-08-14', status: 'SUCCESSFUL' },
  { id: 'TXN-8819', label: 'Technician payout — Grace Wanjiru', type: 'PAYOUT', amount: -18500, date: '2026-08-13', status: 'PENDING' },
  { id: 'TXN-8814', label: 'Escrow hold — Circuit breaker repair (A6)', type: 'ESCROW', amount: 12000, date: '2026-08-13', status: 'PENDING' },
  { id: 'TXN-8802', label: 'Rent payment — Unit 4B (Njeri Kamau)', type: 'RENT', amount: 48000, date: '2026-08-12', status: 'SUCCESSFUL' },
  { id: 'TXN-8795', label: 'Service charge collection — Block C', type: 'SERVICE_CHARGE', amount: 96000, date: '2026-08-10', status: 'SUCCESSFUL' },
  { id: 'TXN-8781', label: 'Technician payout — Dennis Kamau', type: 'PAYOUT', amount: -9600, date: '2026-08-05', status: 'SUCCESSFUL' },
  { id: 'TXN-8763', label: 'Refund — Cancelled painting job (C1)', type: 'REFUND', amount: -1800, date: '2026-07-30', status: 'SUCCESSFUL' },
];

export interface ActivityLogEntry {
  id: string;
  message: string;
  timestamp: string;
}

export const activityLog: ActivityLogEntry[] = [
  { id: 'A-1', message: 'Approved technician verification for Mary Achieng (Electrical)', timestamp: '2026-08-14, 9:12 AM' },
  { id: 'A-2', message: 'New maintenance request MR-1040 opened by Beatrice Wairimu (Unit B4)', timestamp: '2026-08-14, 8:03 AM' },
  { id: 'A-3', message: 'Rent payment received from Faith Njoroge (Unit A1)', timestamp: '2026-08-14, 7:40 AM' },
  { id: 'A-4', message: 'Assigned Brian Mutiso to MR-1041 (Circuit breaker, Unit A6)', timestamp: '2026-08-13, 4:22 PM' },
  { id: 'A-5', message: 'Lucy Atieno lease renewal marked pending review', timestamp: '2026-08-13, 11:05 AM' },
];
