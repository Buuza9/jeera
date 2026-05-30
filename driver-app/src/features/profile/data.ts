// Mock driver profile — later sourced from driverStore / Supabase.
import { type IconName } from '@/shared/components';

export const DRIVER = {
  name: 'Ahmed Al-Tarhouni',
  initials: 'AM',
  phoneMasked: '+218 91 ••• 5678',
  rating: 4.92,
  trips: 312,
  vehicle: { model: 'Honda CG 125', detail: 'Red · Plate 247 TR 5' },
};

export type DocStatus = 'verified' | 'expiring';
export type DriverDoc = { key: string; labelKey: string; status: DocStatus; noteKey: string };

export const DOCS: DriverDoc[] = [
  { key: 'id', labelKey: 'prof.id', status: 'verified', noteKey: 'prof.verified' },
  { key: 'lic', labelKey: 'prof.lic', status: 'expiring', noteKey: 'prof.expiring' },
];

// Profile → links list. `route` set = go there; null = titled "coming soon"
// placeholder (its dedicated screen isn't built yet).
export type ProfileLink = { key: string; icon: IconName; labelKey: string; route: string | null };

export const LINKS: ProfileLink[] = [
  { key: 'rating', icon: 'star', labelKey: 'prof.rating', route: '/ratings' },
  { key: 'langtheme', icon: 'layers', labelKey: 'prof.langtheme', route: null },
  { key: 'notif', icon: 'bell', labelKey: 'prof.notif', route: null },
  { key: 'pin', icon: 'fingerprint', labelKey: 'prof.pin', route: null },
  { key: 'support', icon: 'help', labelKey: 'prof.support', route: '/support' },
];
