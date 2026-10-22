"use client";

import Link from "next/link";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

import { cn } from "@/lib/utils";

interface AdminStatCardProps {
  label: string;
  value: string;
  change: number;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  trend: "up" | "down";
  delay?: number;
}

export function AdminStatCard({
  label,
  value,
  change,
  icon: Icon,
  href,
  trend,
  delay = 0,
}: AdminStatCardProps) {
  return (
    <Link
      href={href}
      style={{ animationDelay: `${delay}ms` }}
      className={cn(
        "group animate-fade-in-up relative overflow-hidden rounded-2xl border border-border bg-card p-5 transition-all duration-200 hover:border-primary/40 hover:shadow-lg hover:-translate-y-0.5"
      )}
    >
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {label}
          </p>
          <p className="mt-2 font-heading text-2xl font-bold tracking-tight text-foreground truncate">
            {value}
          </p>
        </div>
        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[var(--lilac)] text-[var(--primary-deep)]">
          <Icon className="size-5" />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span
            className={cn(
              "flex size-5 items-center justify-center rounded-full text-xs font-semibold",
              trend === "up" ? "bg-[var(--accent)]/15 text-[var(--primary-deep)]" : "bg-[var(--primary-deep)]/10 text-[var(--primary-deep)]"
            )}
          >
            {trend === "up" ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
          </span>
          <span className={cn("text-sm font-semibold", trend === "up" ? "text-[var(--primary-deep)]" : "text-[var(--primary-deep)]")}>
            +{change}%
          </span>
          <span className="text-sm text-muted-foreground">vs last month</span>
        </div>
        <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
          View details →
        </span>
      </div>
    </Link>
  );
}