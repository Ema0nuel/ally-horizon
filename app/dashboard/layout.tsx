"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuthStore } from "@/stores/auth-store";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const isLoading = useAuthStore((s) => s.isLoading);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.replace("/login");
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <span className="size-8 animate-spin rounded-full border-2 border-border border-t-primary" />
          <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Loading your account
          </span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return <DashboardShell>{children}</DashboardShell>;
}
