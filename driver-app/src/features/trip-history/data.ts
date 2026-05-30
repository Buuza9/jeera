// Trip-history mock data — mirrors ../../../driver-prototype/trip-history/.
// Real impl reads completed trips from the trips table.

export type TripRecord = {
  id: string;
  day: 'today' | 'yesterday';
  time: string;
  from: string;
  to: string;
  rider: string;
  km: number;
  lyd: number;
  cancelled?: boolean;
};

export const TRIPS: TripRecord[] = [
  { id: 't1', day: 'today', time: '18:32', from: 'Hai al-Andalus', to: 'Gargaresh', rider: 'Khalid A.', km: 8.5, lyd: 25 },
  { id: 't2', day: 'today', time: '16:14', from: 'Old City', to: 'MJI Airport', rider: 'Mariam S.', km: 14.2, lyd: 42 },
  { id: 't3', day: 'today', time: '13:45', from: 'Dahra', to: 'Janzour', rider: 'Omar B.', km: 11.0, lyd: 32 },
  { id: 't4', day: 'today', time: '11:22', from: 'Souq al-Juma', to: 'Hai al-Andalus', rider: 'Yousef R.', km: 5.8, lyd: 18 },
  { id: 't5', day: 'today', time: '10:08', from: 'Sidi Husayn', to: 'Tajura', rider: 'Faisal M.', km: 12.5, lyd: 36, cancelled: true },
  { id: 't6', day: 'yesterday', time: '20:11', from: 'Gargaresh', to: 'Old City', rider: 'Layla N.', km: 9.2, lyd: 28 },
  { id: 't7', day: 'yesterday', time: '17:30', from: 'MJI Airport', to: 'Hai al-Andalus', rider: 'Ibrahim T.', km: 17.5, lyd: 48 },
  { id: 't8', day: 'yesterday', time: '14:55', from: 'Janzour', to: 'Dahra', rider: 'Salim K.', km: 10.8, lyd: 30 },
];

export const HISTORY_STATS = { trips: 15, cash: 376, hours: 6.2 };

export const COMMISSION_RATE = 0.15; // §5 placeholder — client-blocked

export const commissionOf = (lyd: number) => +(lyd * COMMISSION_RATE).toFixed(2);
export const netOf = (lyd: number) => +(lyd - commissionOf(lyd)).toFixed(2);
export const tripById = (id?: string) => TRIPS.find((t) => t.id === id);

/** Initials from a rider name, e.g. "Khalid Al-Asmari" → "KA". */
export const initials = (name: string) =>
  name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();

/** Strip trailing .00 → "21.25", "21". */
export const stripZeros = (n: number) => n.toFixed(2).replace(/\.00$/, '');
