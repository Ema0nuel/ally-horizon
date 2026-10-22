"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Check, ChevronDown, Languages } from "lucide-react";

import { cn } from "@/lib/utils";
import { changeLanguage } from "@/lib/google-translate";
import { LANGUAGES, useLanguageStore } from "@/stores/language-store";

export function LanguageSelector() {
  const language = useLanguageStore((s) => s.language);
  const setLanguage = useLanguageStore((s) => s.setLanguage);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = LANGUAGES.find((l) => l.code === language) ?? LANGUAGES[0];

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={`Change language (current: ${current.label})`}
        aria-haspopup="menu"
        aria-expanded={open}
        title={`Language: ${current.label}`}
        className="flex h-8 items-center gap-1.5 rounded-lg px-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <Image
          src={current.flag}
          alt=""
          width={18}
          height={18}
          unoptimized
          className="shrink-0 rounded-full object-cover"
        />
        <span className="hidden text-[11px] font-semibold uppercase tracking-wide sm:inline">
          {current.code}
        </span>
        <ChevronDown className="size-3.5" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-48 overflow-hidden rounded-xl border border-border bg-popover p-1 shadow-xl"
        >
          <div className="flex items-center gap-2 px-2.5 py-2 text-xs font-semibold text-muted-foreground">
            <Languages className="size-3.5" />
            Language
          </div>
          {LANGUAGES.map((l) => {
            const active = l.code === language;
            return (
              <button
                key={l.code}
                type="button"
                role="menuitem"
                onClick={() => {
                  setOpen(false);
                  if (l.code === language) return;
                  setLanguage(l.code);
                  changeLanguage(l.code);
                }}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-left transition-colors hover:bg-muted",
                  active ? "text-foreground" : "text-muted-foreground"
                )}
              >
                <Image
                  src={l.flag}
                  alt=""
                  width={18}
                  height={18}
                  unoptimized
                  className="shrink-0 rounded-full object-cover"
                />
                <span className="flex-1 truncate">{l.label}</span>
                {active && <Check className="size-4 text-primary" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
