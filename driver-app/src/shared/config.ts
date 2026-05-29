// Mock-first toggle (playbook). Defaults to true so the app runs with no backend.
// Set EXPO_PUBLIC_USE_MOCKS=false in .env once Supabase is wired.
export const USE_MOCKS = process.env.EXPO_PUBLIC_USE_MOCKS !== 'false';
