"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { Sidebar } from "./sidebar";
import { BottomNav } from "./bottom-nav";
import { TopBar } from "./top-bar";
import { Reveal } from "./reveal";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
      <TopBar />

      <main
        className={cn(
          "min-h-screen transition-[padding] duration-300",
          collapsed ? "lg:pl-[76px]" : "lg:pl-64"
        )}
      >
        <div className="mx-auto w-full max-w-6xl px-4 py-6 pb-28 lg:px-8 lg:py-8 lg:pb-8">
          <Reveal key={pathname}>{children}</Reveal>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
