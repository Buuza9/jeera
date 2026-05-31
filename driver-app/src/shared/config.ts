// Mock-first toggle (playbook). Defaults to true so the app runs with no backend.
// Set EXPO_PUBLIC_USE_MOCKS=false in .env once Supabase is wired.
export const USE_MOCKS = process.env.EXPO_PUBLIC_USE_MOCKS !== 'false';

// Supabase — client-safe values (protected by Row Level Security). EXPO_PUBLIC_*
// is inlined into the bundle; never put the service_role key here.
export const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
export const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';

/** True once both Supabase env vars are present. */
export const SUPABASE_CONFIGURED = !!(SUPABASE_URL && SUPABASE_ANON_KEY);
