// Earnings mock data by period — mirrors ../../../driver-prototype/earnings/.
// Real impl aggregates from the trips/commission ledger.

export type Period = 'today' | 'week' | 'month';

export type BreakdownRow = {
  /** Route origin (today) or bucket label (day/week). */
  from: string;
  /** Route destination — only set for per-trip (today) rows. */
  to?: string;
  sub: string;
  lyd: number;
};

export type PeriodData = {
  net: number;
  prev: number; // % vs previous period
  trips: number;
  cash: number;
  hours: number;
  comm: number;
  /** Index of the highlighted bar (current bucket). */
  hi: number;
  bars: number[];
  labels: string[];
  rows: BreakdownRow[];
};

export const PERIODS: Period[] = ['today', 'week', 'month'];

export const EARNINGS: Record<Period, PeriodData> = {
  today: {
    net: 320, prev: 14, trips: 15, cash: 376, hours: 6.2, comm: 56, hi: 6,
    bars: [12, 24, 18, 32, 40, 36, 52, 48, 28, 22, 18, 14],
    labels: ['6', '', '8', '', '10', '', '12', '', '14', '', '16', '18'],
    rows: [
      { from: 'Hai al-Andalus', to: 'Gargaresh', sub: '18:32 · 8.5 km', lyd: 25 },
      { from: 'Old City', to: 'MJI Airport', sub: '16:14 · 14.2 km', lyd: 42 },
      { from: 'Dahra', to: 'Janzour', sub: '13:45 · 11.0 km', lyd: 32 },
      { from: 'Souq al-Juma', to: 'Hai al-Andalus', sub: '11:22 · 5.8 km', lyd: 18 },
    ],
  },
  week: {
    net: 1840, prev: 8, trips: 78, cash: 2165, hours: 38, comm: 325, hi: 5,
    bars: [220, 285, 310, 270, 295, 330, 130],
    labels: ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    rows: [
      { from: 'Saturday', sub: '9 trips · 38 km', lyd: 220 },
      { from: 'Sunday', sub: '12 trips · 52 km', lyd: 285 },
      { from: 'Monday', sub: '14 trips · 61 km', lyd: 310 },
      { from: 'Tuesday', sub: '11 trips · 45 km', lyd: 270 },
    ],
  },
  month: {
    net: 7240, prev: 12, trips: 312, cash: 8520, hours: 156, comm: 1280, hi: 2,
    bars: [1620, 1840, 1980, 1800],
    labels: ['W1', 'W2', 'W3', 'W4'],
    rows: [
      { from: 'Week 1', sub: '72 trips · 308 km', lyd: 1620 },
      { from: 'Week 2', sub: '78 trips · 342 km', lyd: 1840 },
      { from: 'Week 3', sub: '84 trips · 364 km', lyd: 1980 },
    ],
  },
};

/** Thousands separator that doesn't depend on Intl (Hermes-safe). */
export const group = (n: number) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
