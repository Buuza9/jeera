import { USE_MOCKS } from '@/shared/config';

import { type AuthMethod, type Session } from './store';

/** Mock OTP that always succeeds. Real backend validates server-side. */
export const MOCK_CODE = '123456';

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Request a one-time code for the given identifier.
 * Mock: resolves after a short delay (code is always {@link MOCK_CODE}).
 * Real: Supabase email OTP (`signInWithOtp`); phone/SMS is deferred.
 */
export async function requestOtp(via: AuthMethod, to: string): Promise<void> {
  if (USE_MOCKS) {
    await wait(600);
    return;
  }
  // TODO: supabase.auth.signInWithOtp({ email: to }) once backend is wired.
  throw new Error('Live OTP not implemented yet — set EXPO_PUBLIC_USE_MOCKS=true');
}

/**
 * Verify a 6-digit code and return a session on success.
 * Mock: succeeds only for {@link MOCK_CODE}.
 */
export async function verifyOtp(via: AuthMethod, to: string, code: string): Promise<Session> {
  if (USE_MOCKS) {
    await wait(700);
    if (code !== MOCK_CODE) throw new Error('INVALID_CODE');
    return { token: `mock-${Date.now()}`, identifier: to, via };
  }
  // TODO: supabase.auth.verifyOtp({ email: to, token: code, type: 'email' }).
  throw new Error('Live OTP not implemented yet — set EXPO_PUBLIC_USE_MOCKS=true');
}
