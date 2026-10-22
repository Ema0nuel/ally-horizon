"use client";

import { create } from "zustand";

type AdminAuthState = {
  isAuthenticated: boolean;
  isLoading: boolean;
  adminEmail: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  checkAuth: () => Promise<boolean>;
};

// Credentials never touch the browser. The server validates them and returns
// an HttpOnly session cookie that every admin request carries.
export const useAdminAuthStore = create<AdminAuthState>((set) => ({
  isAuthenticated: false,
  isLoading: true,
  adminEmail: null,

  setLoading: (loading) => set({ isLoading: loading }),

  checkAuth: async () => {
    try {
      const res = await fetch("/api/admin/me", { credentials: "same-origin" });
      if (res.ok) {
        set({ isAuthenticated: true, isLoading: false });
        return true;
      }
    } catch {
      // fall through to unauthenticated
    }
    set({ isAuthenticated: false, adminEmail: null, isLoading: false });
    return false;
  },

  login: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        set({ isAuthenticated: true, adminEmail: email, isLoading: false });
        return true;
      }
    } catch {
      // fall through to failure
    }
    set({ isAuthenticated: false, adminEmail: null, isLoading: false });
    return false;
  },

  logout: () => {
    fetch("/api/admin/logout", {
      method: "POST",
      credentials: "same-origin",
    }).catch(() => {});
    set({ isAuthenticated: false, adminEmail: null });
  },
}));
