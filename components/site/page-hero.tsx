import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { LogoMark } from "./logo-mark";

type PageHeroProps = {
  title: string;
  subtitle?: ReactNode;
  image?: string;
  showLogo?: boolean;
  align?: "center" | "left";
  className?: string;
  children?: ReactNode;
};

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=1200&q=80";

export function PageHero({
  title,
  subtitle,
  image = DEFAULT_IMAGE,
  showLogo = false,
  align = "center",
  className,
  children,
}: PageHeroProps) {
  return (
    <section
      className={cn(
        "relative flex min-h-[320px] w-full items-center overflow-hidden md:min-h-[440px]",
        className
      )}
    >
      <div
        aria-hidden
        className="absolute inset-0 bg-cover bg-center bg-right"
        style={{ backgroundImage: `url('${image}')` }}
      />
      <div aria-hidden className="absolute inset-0 bg-black/55 dark:bg-black/75" />
      <div className="relative z-10 mx-auto flex w-full max-w-5xl items-center px-6 py-12">
        <div
          className={cn(
            "flex flex-1 flex-col gap-4",
            align === "center"
              ? "items-center text-center"
              : "items-center text-center md:items-start md:text-left"
          )}
        >
          {showLogo && <LogoMark className="h-14" />}
          <h1 className="max-w-4xl text-balance text-4xl font-extralight tracking-[-0.03em] text-white drop-shadow-lg md:text-5xl">
            {title}
          </h1>
          {subtitle && (
            <div className="max-w-2xl text-lg text-white/90 md:text-xl">
              {subtitle}
            </div>
          )}
          {children}
        </div>
      </div>
    </section>
  );
}
