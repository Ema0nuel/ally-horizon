"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useAdminAuthStore } from "@/stores/admin-auth-store";
import { AdminShell } from "@/components/admin/admin-shell";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const isLoading = useAdminAuthStore((s) => s.isLoading);
  const isAuthenticated = useAdminAuthStore((s) => s.isAuthenticated);
  const checkAuth = useAdminAuthStore((s) => s.checkAuth);

  const isLoginPage = pathname === "/admin/login";

  // Initialize auth on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Redirect if not authenticated (skipped on the login page)
  useEffect(() => {
    if (isLoginPage) return;
    if (!isLoading && !isAuthenticated) {
      router.replace("/admin/login");
    }
  }, [isLoginPage, isLoading, isAuthenticated, router]);

  // The login page must render regardless of auth state.
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <span className="size-8 animate-spin rounded-full border-2 border-border border-t-primary" />
          <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Loading admin panel
          </span>
        </div>
      </div>
    );
  }

  // Not authenticated - show nothing (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  return <AdminShell>{children}</AdminShell>;
}