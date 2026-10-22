"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ChevronDown, LogOut, PanelLeftClose, PanelLeftOpen } from "lucide-react";

import { cn } from "@/lib/utils";
import { getInitials, maskAccountNumber } from "@/lib/format";
import { useAuthStore } from "@/stores/auth-store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";
import { LanguageSelector } from "@/components/language-selector";
import { isActivePath, sidebarNav } from "./nav";
import type { Account, Profile } from "./types";

export function Sidebar({
  collapsed,
  onToggle,
}: {
  collapsed: boolean;
  onToggle: () => void;
}) {
  const pathname = usePathname();
  const signOut = useAuthStore((s) => s.signOut);
  const profile = useAuthStore((s) => s.profile) as Profile | null;
  const account = useAuthStore((s) => s.account) as Account | null;
  const [openGroup, setOpenGroup] = useState<string | null>("Transfers");

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-40 hidden flex-col border-r border-border bg-[var(--card)] transition-[width] duration-300 lg:flex",
        collapsed ? "w-[76px]" : "w-64"
      )}
    >
      <div className="flex h-16 items-center gap-2 border-b border-border px-3">
        <Link href="/dashboard" className="flex min-w-0 items-center gap-2.5">
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
          {!collapsed && (
            <span className="truncate font-heading text-base font-bold text-primary">
              Ally
            </span>
          )}
        </Link>

        {!collapsed && (
          <div className="ml-auto flex items-center gap-1">
            <LanguageSelector />
            <ThemeToggle />
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {sidebarNav.map((item) => {
            const active = isActivePath(item.href, pathname);
            const children = item.children ?? [];
            const hasChildren = children.length > 0;
            const isOpen = openGroup === item.label;

            return (
              <li key={item.href}>
                {hasChildren ? (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        if (collapsed) onToggle();
                        setOpenGroup((g) => (g === item.label ? null : item.label));
                      }}
                      title={collapsed ? item.label : undefined}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors",
                        active
                          ? "bg-[var(--lilac)] text-[var(--primary-deep)]"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground",
                        collapsed && "justify-center px-0"
                      )}
                    >
                      <item.icon
                        className="size-5 shrink-0"
                        strokeWidth={active ? 2.2 : 1.8}
                      />
                      {!collapsed && (
                        <>
                          <span>{item.label}</span>
                          <ChevronDown
                            className={cn(
                              "ml-auto size-4 transition-transform",
                              isOpen && "rotate-180"
                            )}
                          />
                        </>
                      )}
                    </button>

                    {!collapsed && isOpen && (
                      <ul className="ml-4 mt-1 space-y-1 border-l border-border pl-2">
                        {children.map((child) => {
                          const childActive = isActivePath(child.href, pathname);
                          return (
                            <li key={child.href}>
                              <Link
                                href={child.href}
                                className={cn(
                                  "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors",
                                  childActive
                                    ? "bg-[var(--lilac)] font-semibold text-[var(--primary-deep)]"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                )}
                              >
                                <span
                                  className={cn(
                                    "size-1.5 rounded-full",
                                    childActive ? "bg-primary" : "bg-muted-foreground/40"
                                  )}
                                />
                                {child.label}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href}
                    title={collapsed ? item.label : undefined}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors",
                      active
                        ? "bg-[var(--lilac)] text-[var(--primary-deep)]"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                      collapsed && "justify-center px-0"
                    )}
                  >
                    <item.icon
                      className="size-5 shrink-0"
                      strokeWidth={active ? 2.2 : 1.8}
                    />
                    {!collapsed && <span>{item.label}</span>}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-border p-3">
        {!collapsed && (
          <div className="mb-3 flex items-center gap-3 rounded-xl bg-muted/60 p-3">
            <Avatar>
              {profile?.avatar_url && (
                <AvatarImage src={profile.avatar_url} alt={profile.full_name ?? "Profile"} />
              )}
              <AvatarFallback>
                {getInitials(profile?.full_name ?? profile?.username ?? "")}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-foreground">
                {profile?.full_name ?? "Account holder"}
              </p>
              <p className="truncate font-mono text-xs text-muted-foreground">
                {maskAccountNumber(account?.account_number)}
              </p>
            </div>
          </div>
        )}

        <Button
          variant="ghost"
          onClick={onToggle}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className={cn(
            "w-full justify-start gap-3",
            collapsed && "justify-center px-0"
          )}
        >
          {collapsed ? (
            <PanelLeftOpen className="size-5" />
          ) : (
            <>
              <PanelLeftClose className="size-5" />
              <span>Collapse</span>
            </>
          )}
        </Button>

        <Button
          variant="ghost"
          onClick={signOut}
          className={cn(
            "mt-1 w-full justify-start gap-3 text-[var(--primary-deep)] hover:text-[var(--primary-deep)]",
            collapsed && "justify-center px-0"
          )}
        >
          <LogOut className="size-5" />
          {!collapsed && <span>Sign out</span>}
        </Button>
      </div>
    </aside>
  );
}
