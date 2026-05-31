import { USE_MOCKS } from '@/shared/config';
import { getSupabase } from '@/shared/supabase';

import { type AuthMethod, type Session } from './store';

/** Mock OTP that always succeeds. Real backend validates server-side. */
export const MOCK_CODE = '123456';

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Request a one-time code for the given identifier.
 * Mock: resolves after a short delay (code is always {@link MOCK_CODE}).
 * Real: Supabase email OTP (`signInWithOtp`). Phone/SMS is deferred — until an
 * SMS provider is wired, only email is supported on the live path.
 */
export async function requestOtp(via: AuthMethod, to: string): Promise<void> {
  if (USE_MOCKS) {
    await wait(600);
    return;
  }
  if (via !== 'email') throw new Error('Phone OTP is not available yet — use email.');
  const { error } = await getSupabase().auth.signInWithOtp({
    email: to,
    options: { shouldCreateUser: true },
  });
  if (error) throw error;
}

/**
 * Verify a 6-digit code and return a session on success.
 * Mock: succeeds only for {@link MOCK_CODE}.
 * Real: Supabase `verifyOtp` → returns the session access token.
 */
export async function verifyOtp(via: AuthMethod, to: string, code: string): Promise<Session> {
  if (USE_MOCKS) {
    await wait(700);
    if (code !== MOCK_CODE) throw new Error('INVALID_CODE');
    return { token: `mock-${Date.now()}`, identifier: to, via };
  }
  if (via !== 'email') throw new Error('Phone OTP is not available yet — use email.');
  const { data, error } = await getSupabase().auth.verifyOtp({ email: to, token: code, type: 'email' });
  if (error || !data.session) throw new Error('INVALID_CODE');
  return { token: data.session.access_token, identifier: to, via };
}
