"use client";

import { Moon, Monitor, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useSettingsStore, type Theme } from "@/stores/settings-store";

const order: Theme[] = ["light", "dark", "system"];

const labels: Record<Theme, string> = {
  light: "Light theme",
  dark: "Dark theme",
  system: "System theme",
};

export function ThemeToggle() {
  const theme = useSettingsStore((s) => s.theme);
  const setTheme = useSettingsStore((s) => s.setTheme);

  const next = () => {
    const idx = order.indexOf(theme);
    setTheme(order[(idx + 1) % order.length]);
  };

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={next}
      aria-label={labels[theme]}
      title={labels[theme]}
    >
      {theme === "light" && <Sun className="size-4" />}
      {theme === "dark" && <Moon className="size-4" />}
      {theme === "system" && <Monitor className="size-4" />}
    </Button>
  );
}
