// Commission feature mock data — mirrors ../../../driver-prototype/commission/*.
// Rate · cap · approved channels · grace period are all client-blocked (§5);
// the values here are placeholders surfaced behind TODO chips in the UI.

export const COMMISSION_RATE = 0.15; // §5 placeholder — admin-configured
export const SETTLEMENT_CAP = 200; // LYD §5 placeholder — auto-suspend threshold

/** Current outstanding balance (in-memory mock seed; real impl reads the ledger). */
export const OUTSTANDING_SEED = 48; // LYD

export type ChannelId = 'bank' | 'office' | 'mobile';

import { type IconName } from '@/shared/components';

export const CHANNELS: { id: ChannelId; icon: IconName }[] = [
  { id: 'bank', icon: 'bankTransfer' },
  { id: 'office', icon: 'building' },
  { id: 'mobile', icon: 'device' },
];

/** Per-trip accruals shown on the balance screen (`+fare × rate`). */
export type Accrual = { id: string; trip: string; fare: number; commission: number; time: string };

export const ACCRUALS: Accrual[] = [
  { id: 'a1', trip: 'Hai al-Andalus → Gargaresh', fare: 25, commission: 3.75, time: 'Today 18:32' },
  { id: 'a2', trip: 'Old City → MJI Airport', fare: 42, commission: 6.3, time: 'Today 16:14' },
  { id: 'a3', trip: 'Dahra → Janzour', fare: 32, commission: 4.8, time: 'Today 13:45' },
  { id: 'a4', trip: 'Souq al-Juma → Hai al-Andalus', fare: 18, commission: 2.7, time: 'Today 11:22' },
];

/** Past settlements, grouped by month (`monthKey` → i18n label). */
export type Settlement = {
  id: string;
  channel: ChannelId;
  amount: number;
  date: string;
  ref: string;
  monthKey: string;
};

export const SETTLEMENTS: Settlement[] = [
  { id: 's1', channel: 'bank', amount: 52, date: '18 May · 09:12', ref: 'JRA-48102', monthKey: 'com.h.may' },
  { id: 's2', channel: 'office', amount: 64, date: '11 May · 17:40', ref: 'JRA-47980', monthKey: 'com.h.may' },
  { id: 's3', channel: 'mobile', amount: 41, date: '4 May · 20:05', ref: 'JRA-47845', monthKey: 'com.h.may' },
  { id: 's4', channel: 'bank', amount: 58, date: '27 Apr · 11:28', ref: 'JRA-47702', monthKey: 'com.h.apr' },
  { id: 's5', channel: 'office', amount: 47, date: '20 Apr · 16:02', ref: 'JRA-47588', monthKey: 'com.h.apr' },
];

export const HISTORY_SUMMARY = { thisMonth: 215, allTime: 1840 };

/** Suspended demo state — overdue balance that exceeds the cap. */
export const SUSPENDED = { balance: 215, cap: SETTLEMENT_CAP, since: '18 May' };

/** Next-settlement schedule shown on the balance screen. */
export const NEXT_SETTLEMENT = { day: 'Sunday', inDays: 4 };

export const accrued = (fare: number, rate = COMMISSION_RATE) => +(fare * rate).toFixed(2);
