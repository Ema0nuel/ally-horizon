"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu } from "lucide-react";
import { useAdminAuthStore } from "@/stores/admin-auth-store";

export function AdminTopBar({ onMenuClick }: { onMenuClick: () => void }) {
  const { adminEmail } = useAdminAuthStore();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur lg:hidden">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open menu"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-muted"
        >
          <Menu className="size-5" />
        </button>
        <Link href="/admin" className="flex items-center gap-2.5">
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
        </Link>
      </div>

      <div className="flex items-center gap-1.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
          {adminEmail?.[0]?.toUpperCase() || "A"}
        </div>
      </div>
    </header>
  );
}
