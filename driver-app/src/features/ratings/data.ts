// Ratings mock data — mirrors ../../../driver-prototype/ratings/.

export const OVERVIEW = {
  rating: 4.92,
  count: 312,
  // [stars, count, bar %]
  breakdown: [
    { stars: 5, n: 291, pct: 93 },
    { stars: 4, n: 15, pct: 5 },
    { stars: 3, n: 4, pct: 1 },
    { stars: 2, n: 1, pct: 1 },
    { stars: 1, n: 1, pct: 1 },
  ],
  behaviour: [
    { key: 'rat.accept', value: 96 },
    { key: 'rat.cancel', value: 2 },
    { key: 'rat.complete', value: 99 },
  ],
};

export type Review = {
  id: string;
  initials: string;
  nameKey: string;
  agoKey: string;
  stars: number;
  commentKey: string;
  tagKeys: string[];
};

export const REVIEWS: Review[] = [
  { id: 'r1', initials: 'MS', nameKey: 'rat.r1.n', agoKey: 'rat.ago.2h', stars: 5, commentKey: 'rat.r1.c', tagKeys: ['rat.t.polite', 'rat.t.safe'] },
  { id: 'r2', initials: 'OB', nameKey: 'rat.r2.n', agoKey: 'rat.ago.1d', stars: 5, commentKey: 'rat.r2.c', tagKeys: ['rat.t.ontime'] },
  { id: 'r3', initials: 'LN', nameKey: 'rat.r3.n', agoKey: 'rat.ago.3d', stars: 4, commentKey: 'rat.r3.c', tagKeys: ['rat.t.clean', 'rat.t.polite'] },
];

// Rate-the-rider screen.
export const RATE_TAGS = ['rr.t.polite', 'rr.t.ontime', 'rr.t.respectful', 'rr.t.clear'];
export const RATE_HINTS = ['', 'rr.h1', 'rr.h2', 'rr.h3', 'rr.h4', 'rr.h5']; // index by rating 0–5
