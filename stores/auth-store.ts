"use client";

import { create } from "zustand";
import { getBrowserClient } from "@/lib/supabase/browser";

type AuthUser = {
  id: string;
  email: string;
};

type AuthState = {
  user: AuthUser | null;
  profile: Record<string, unknown> | null;
  account: Record<string, unknown> | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  initialize: () => Promise<void>;
  signOut: () => Promise<void>;
  setAuthenticated: (user: AuthUser) => Promise<void>;
  setLoading: (loading: boolean) => void;
  setProfile: (profile: Record<string, unknown> | null) => void;
  setAccount: (account: Record<string, unknown> | null) => void;
};

export const useAuthStore = create<AuthState>((set) => {
  const hydrateProfile = async (userId: string) => {
    const supabase = getBrowserClient();

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    const { data: account } = await supabase
      .from("accounts")
      .select("*")
      .eq("user_id", userId)
      .single();

    set({ profile: profile ?? null, account: account ?? null });
  };

  return {
    user: null,
    profile: null,
    account: null,
    isAuthenticated: false,
    isLoading: true,

    setLoading: (loading) => set({ isLoading: loading }),

    setProfile: (profile) => set({ profile }),

    setAccount: (account) => set({ account }),

    setAuthenticated: async (user) => {
      set({ user, isAuthenticated: true, isLoading: false });
      await hydrateProfile(user.id);
    },

    signOut: async () => {
      const supabase = getBrowserClient();
      await supabase.auth.signOut();
      set({
        user: null,
        profile: null,
        account: null,
        isAuthenticated: false,
        isLoading: false,
      });
    },

    initialize: async () => {
      const supabase = getBrowserClient();
      set({ isLoading: true });

      const { data } = await supabase.auth.getSession();
      if (data?.session?.user) {
        set({
          user: { id: data.session.user.id, email: data.session.user.email ?? "" },
          isAuthenticated: true,
        });
        await hydrateProfile(data.session.user.id);
      }
      set({ isLoading: false });

      supabase.auth.onAuthStateChange((event, session) => {
        if (event === "SIGNED_OUT") {
          set({ user: null, profile: null, account: null, isAuthenticated: false });
        } else if (
          session?.user &&
          (event === "SIGNED_IN" || event === "TOKEN_REFRESHED")
        ) {
          set({
            user: { id: session.user.id, email: session.user.email ?? "" },
            isAuthenticated: true,
          });
          hydrateProfile(session.user.id);
        }
      });
    },
  };
});
