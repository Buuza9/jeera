import { USE_MOCKS } from '@/shared/config';

import { type Application } from './store';

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Submit a driver application for review.
 * Mock: resolves after a short delay. Real: POST to Supabase + upload docs to
 * Storage, then the admin approves/rejects (TODO).
 */
export async function submitEnrollment(application: Application): Promise<void> {
  if (USE_MOCKS) {
    await wait(700);
    return;
  }
  throw new Error('Live enrollment not implemented yet — set EXPO_PUBLIC_USE_MOCKS=true');
}

/** Mask a national ID for display: keep first 4 digits, mask the rest. */
export function maskId(id: string): string {
  const digits = id.replace(/\s/g, '');
  if (digits.length <= 4) return digits;
  return digits.slice(0, 4) + '*'.repeat(digits.length - 4);
}
