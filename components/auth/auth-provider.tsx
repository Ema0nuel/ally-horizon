"use client";

import { useEffect } from "react";

import { useAuthStore } from "@/stores/auth-store";

export function AuthProvider() {
  const initialize = useAuthStore((s) => s.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return null;
}
