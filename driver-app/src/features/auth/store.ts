import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { SUPABASE_CONFIGURED, USE_MOCKS } from "@/shared/config";
import { getSupabase } from "@/shared/supabase";
import { secureStorage } from "@/shared/store/secureStorage";

export type AuthMethod = "phone" | "email";

export type Session = {
  token: string;
  /** The verified identifier (email or +218 phone). */
  identifier: string;
  via: AuthMethod;
};

type AuthState = {
  session: Session | null;
  /** Hydration flag — true once persisted state has loaded from secure-store. */
  hydrated: boolean;
  signIn: (session: Session) => void;
  signOut: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      session: null,
      hydrated: false,
      signIn: (session) => set({ session }),
      signOut: () => {
        set({ session: null });
        // Also clear the Supabase session (fire-and-forget) in live mode.
        if (!USE_MOCKS && SUPABASE_CONFIGURED) getSupabase().auth.signOut().catch(() => {});
      },
    }),
    {
      name: "djera.auth",
      storage: createJSONStorage(() => secureStorage),
      partialize: (s) => ({ session: s.session }),
      onRehydrateStorage: () => (state) => {
        // Mark hydrated so the boot gate can wait for secure-store.
        useAuthStore.setState({ hydrated: true });
        return state;
      },
    },
  ),
);

export const useIsAuthenticated = () => useAuthStore((s) => !!s.session);
