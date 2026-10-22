"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LogOut,
  LayoutDashboard,
  Users,
  CreditCard,
  History,
  BarChart3,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAdminAuthStore } from "@/stores/admin-auth-store";

const adminNav = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Transactions", href: "/admin/transactions", icon: History },
  { label: "Loans", href: "/admin/loans", icon: CreditCard },
  { label: "Cards", href: "/admin/cards", icon: BarChart3 },
];

function isActive(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin" || pathname === "/admin/dashboard";
  return pathname === href || pathname.startsWith(href + "/");
}

export function AdminSidebar({
  collapsed,
  onToggle,
  mobileOpen,
  onClose,
}: {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const { adminEmail, logout } = useAdminAuthStore();

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-border bg-[var(--card)] transition-transform duration-300 lg:w-auto lg:translate-x-0",
        collapsed ? "lg:w-[76px]" : "lg:w-64",
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="flex h-16 items-center gap-2 border-b border-border px-3">
        <Link href="/admin" onClick={onClose} className="flex min-w-0 items-center gap-2.5">
          <Image
            src="/images/logo.png"
            alt="Ally"
            width={0}
            height={0}
            sizes="100vw"
            className="h-8 w-auto shrink-0 dark:hidden"
          />
          <Image
            src="/images/logo.png"
            alt="Ally"
            width={0}
            height={0}
            sizes="100vw"
            className="hidden h-8 w-auto shrink-0 dark:block"
          />
          <span className={cn("truncate font-heading text-base font-bold text-primary", collapsed && "lg:hidden")}>
            Ally Admin
          </span>
        </Link>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onClose}
          aria-label="Close menu"
          className="ml-auto lg:hidden"
        >
          <X className="size-4" />
        </Button>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {adminNav.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  title={collapsed ? item.label : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors",
                    active
                      ? "bg-[var(--lilac)] text-[var(--primary-deep)]"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    collapsed && "lg:justify-center lg:px-0"
                  )}
                >
                  <item.icon className="size-5 shrink-0" strokeWidth={active ? 2.2 : 1.8} />
                  <span className={cn(collapsed && "lg:hidden")}>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-border p-3">
        {adminEmail && (
          <div className="mb-3 px-3 py-2 text-sm">
            <p className="font-semibold text-foreground">Admin</p>
            <p className="truncate font-mono text-xs text-muted-foreground">{adminEmail}</p>
          </div>
        )}

        <Button
          variant="ghost"
          onClick={onToggle}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className={cn(
            "hidden w-full justify-start gap-3 lg:flex",
            collapsed && "lg:justify-center lg:px-0"
          )}
        >
          {collapsed ? (
            <LayoutDashboard className="size-5" />
          ) : (
            <>
              <LogOut className="size-5" />
              <span>Collapse</span>
            </>
          )}
        </Button>

        <Button
          variant="ghost"
          onClick={logout}
          className={cn(
            "mt-1 w-full justify-start gap-3 text-[var(--primary-deep)] hover:text-[var(--primary-deep)]",
            collapsed && "lg:justify-center lg:px-0"
          )}
        >
          <LogOut className="size-5" />
          <span className={cn(collapsed && "lg:hidden")}>Sign out</span>
        </Button>
      </div>
    </aside>
  );
}
