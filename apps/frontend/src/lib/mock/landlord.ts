export const landlordProfile = {
  firstName: 'Elizabeth',
  lastName: 'Wangui',
  initials: 'EW',
  email: 'elizabeth.wangui@example.com',
  memberSince: 'November 2021',
  portfolioValue: 148000000,
  currency: 'KES',
};

export type VacancyListingStatus = 'DRAFT' | 'PUBLISHED' | 'UNDER_CONTRACT' | 'ARCHIVED';

export interface LandlordVacancy {
  id: string;
  title: string;
  neighborhood: string;
  rentAmount: number;
  depositAmount: number;
  bedrooms: number;
  bathrooms: number;
  status: VacancyListingStatus;
  image: string;
  views: number;
  applicantCount: number;
  publishedAt?: string;
}

export const vacancyListings: LandlordVacancy[] = [
  {
    id: '1',
    title: 'Luxury Apartment in Westlands',
    neighborhood: 'Westlands',
    rentAmount: 45000,
    depositAmount: 90000,
    bedrooms: 2,
    bathrooms: 2,
    status: 'PUBLISHED',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=600&auto=format&fit=crop',
    views: 412,
    applicantCount: 3,
    publishedAt: '2026-08-01',
  },
  {
    id: '3',
    title: 'Modern 3-Bedroom Townhouse',
    neighborhood: 'Lavington',
    rentAmount: 80000,
    depositAmount: 160000,
    bedrooms: 3,
    bathrooms: 3,
    status: 'PUBLISHED',
    image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=600&auto=format&fit=crop',
    views: 268,
    applicantCount: 2,
    publishedAt: '2026-07-22',
  },
  {
    id: '6',
    title: 'Executive 4-Bedroom Family Home',
    neighborhood: 'Lavington',
    rentAmount: 120000,
    depositAmount: 240000,
    bedrooms: 4,
    bathrooms: 4,
    status: 'UNDER_CONTRACT',
    image: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?q=80&w=600&auto=format&fit=crop',
    views: 590,
    applicantCount: 5,
    publishedAt: '2026-06-30',
  },
  {
    id: '7',
    title: 'Garden Studio in Kileleshwa',
    neighborhood: 'Kileleshwa',
    rentAmount: 28000,
    depositAmount: 56000,
    bedrooms: 1,
    bathrooms: 1,
    status: 'DRAFT',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=600&auto=format&fit=crop',
    views: 0,
    applicantCount: 0,
  },
];

export type ApplicationStatus = 'SUBMITTED' | 'REVIEWING' | 'APPROVED' | 'DECLINED';

export interface VacancyApplication {
  id: string;
  vacancyId: string;
  vacancyTitle: string;
  applicantName: string;
  applicantInitials: string;
  monthlyIncome: number;
  employerName: string;
  status: ApplicationStatus;
  appliedAt: string;
  notes: string;
}

export const applications: VacancyApplication[] = [
  {
    id: 'APP-501',
    vacancyId: '6',
    vacancyTitle: 'Executive 4-Bedroom Family Home',
    applicantName: 'Caroline Muthama',
    applicantInitials: 'CM',
    monthlyIncome: 420000,
    employerName: 'Safaricom PLC',
    status: 'APPROVED',
    appliedAt: '2026-08-05',
    notes: 'Relocating from Runda, moving in with family. Employer letter and 6-month bank statements verified.',
  },
  {
    id: 'APP-498',
    vacancyId: '1',
    vacancyTitle: 'Luxury Apartment in Westlands',
    applicantName: 'Kevin Muriithi',
    applicantInitials: 'KM',
    monthlyIncome: 180000,
    employerName: 'Absa Bank Kenya',
    status: 'REVIEWING',
    appliedAt: '2026-08-12',
    notes: 'Single applicant, requested a viewing for this weekend.',
  },
  {
    id: 'APP-497',
    vacancyId: '1',
    vacancyTitle: 'Luxury Apartment in Westlands',
    applicantName: 'Brenda Akinyi',
    applicantInitials: 'BA',
    monthlyIncome: 150000,
    employerName: 'Deloitte East Africa',
    status: 'SUBMITTED',
    appliedAt: '2026-08-13',
    notes: 'Referred by current tenant of a neighboring unit.',
  },
  {
    id: 'APP-493',
    vacancyId: '3',
    vacancyTitle: 'Modern 3-Bedroom Townhouse',
    applicantName: 'Felix Odera',
    applicantInitials: 'FO',
    monthlyIncome: 260000,
    employerName: 'KCB Group',
    status: 'REVIEWING',
    appliedAt: '2026-08-10',
    notes: 'Family of four, two school-going children. Requested a 2-year lease.',
  },
  {
    id: 'APP-489',
    vacancyId: '3',
    vacancyTitle: 'Modern 3-Bedroom Townhouse',
    applicantName: 'Susan Nafula',
    applicantInitials: 'SN',
    monthlyIncome: 95000,
    employerName: 'Self-employed (Boutique owner)',
    status: 'DECLINED',
    appliedAt: '2026-08-02',
    notes: 'Income-to-rent ratio below the 3x minimum for this listing.',
  },
];

export interface OwnedProperty {
  id: string;
  name: string;
  type: 'MANAGED_COMPLEX' | 'STANDALONE_UNIT';
  neighborhood: string;
  units: number;
  occupied: number;
  monthlyRent: number;
  managedBy?: string;
}

export const ownedProperties: OwnedProperty[] = [
  {
    id: 'P-1',
    name: 'Kilimani Heights',
    type: 'MANAGED_COMPLEX',
    neighborhood: 'Kilimani, Nairobi',
    units: 24,
    occupied: 19,
    monthlyRent: 1902000,
    managedBy: 'Daniel Mwendwa (Apartment Admin)',
  },
  {
    id: 'P-2',
    name: 'Luxury Apartment, Westlands',
    type: 'STANDALONE_UNIT',
    neighborhood: 'Westlands',
    units: 1,
    occupied: 0,
    monthlyRent: 45000,
  },
  {
    id: 'P-3',
    name: 'Townhouse, Lavington',
    type: 'STANDALONE_UNIT',
    neighborhood: 'Lavington',
    units: 1,
    occupied: 0,
    monthlyRent: 80000,
  },
  {
    id: 'P-4',
    name: 'Family Home, Lavington',
    type: 'STANDALONE_UNIT',
    neighborhood: 'Lavington',
    units: 1,
    occupied: 1,
    monthlyRent: 120000,
  },
];

export const payoutSummary = {
  grossRentCollected: 1902000,
  managementFeePct: 8,
  managementFee: 152160,
  netPayout: 1749840,
  pendingPayout: 1749840,
  currency: 'KES',
};

export interface PayoutTransaction {
  id: string;
  label: string;
  amount: number;
  date: string;
  status: 'PENDING' | 'PAID' | 'FAILED';
}

export const payoutHistory: PayoutTransaction[] = [
  { id: 'PO-2208', label: 'Kilimani Heights — August net payout (after 8% management fee)', amount: 1749840, date: '2026-08-15', status: 'PENDING' },
  { id: 'PO-2195', label: 'Kilimani Heights — July net payout (after 8% management fee)', amount: 1693600, date: '2026-07-15', status: 'PAID' },
  { id: 'PO-2181', label: 'Kilimani Heights — June net payout (after 8% management fee)', amount: 1619200, date: '2026-06-15', status: 'PAID' },
  { id: 'PO-2170', label: 'Family Home, Lavington — rent (direct tenancy)', amount: 120000, date: '2026-08-05', status: 'PAID' },
  { id: 'PO-2158', label: 'Kilimani Heights — May net payout (after 8% management fee)', amount: 1550800, date: '2026-05-15', status: 'PAID' },
];
