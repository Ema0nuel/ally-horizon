"use client";

import Link from "next/link";
import Image from "next/image";

import { getInitials } from "@/lib/format";
import { useAuthStore } from "@/stores/auth-store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "./theme-toggle";
import { LanguageSelector } from "@/components/language-selector";
import type { Profile } from "./types";

export function TopBar() {
  const profile = useAuthStore((s) => s.profile) as Profile | null;

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur lg:hidden">
      <Link href="/dashboard" className="flex items-center gap-2.5">
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

      <div className="flex items-center gap-1.5">
        <LanguageSelector />
        <ThemeToggle />
        <Link href="/dashboard/profile" aria-label="Profile">
          <Avatar className="size-9">
            {profile?.avatar_url && (
              <AvatarImage src={profile.avatar_url} alt={profile.full_name ?? "Profile"} />
            )}
            <AvatarFallback>
              {getInitials(profile?.full_name ?? profile?.username ?? "")}
            </AvatarFallback>
          </Avatar>
        </Link>
      </div>
    </header>
  );
}
