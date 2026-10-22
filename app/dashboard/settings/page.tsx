"use client";

import { Moon, Monitor, RotateCcw, Sun } from "lucide-react";

import { cn } from "@/lib/utils";
import { bankConfig } from "@/lib/bank-config";
import {
  useSettingsStore,
  type NotificationPrefs,
  type Theme,
} from "@/stores/settings-store";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SelectField } from "@/components/dashboard/select-field";
import { PageHeader } from "@/components/dashboard/page-header";

const themeOptions: { value: Theme; label: string; icon: typeof Sun }[] = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
];

const currencyOptions = bankConfig.currencies.map((c) => ({
  value: c.code,
  label: `${c.code} — ${c.label}`,
}));

const localeOptions = bankConfig.locales.map((l) => ({
  value: l.code,
  label: l.label,
}));

export default function SettingsPage() {
  const theme = useSettingsStore((s) => s.theme);
  const currency = useSettingsStore((s) => s.currency);
  const locale = useSettingsStore((s) => s.locale);
  const notifications = useSettingsStore((s) => s.notifications);
  const privacy = useSettingsStore((s) => s.privacy);
  const setTheme = useSettingsStore((s) => s.setTheme);
  const setCurrency = useSettingsStore((s) => s.setCurrency);
  const setLocale = useSettingsStore((s) => s.setLocale);
  const setNotification = useSettingsStore((s) => s.setNotification);
  const setPrivacy = useSettingsStore((s) => s.setPrivacy);
  const reset = useSettingsStore((s) => s.reset);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Settings"
        description="Customize how Ally looks and behaves. Changes are saved on this device."
        crumbs={[{ label: "Settings" }]}
        actions={
          <Button variant="outline" onClick={reset}>
            <RotateCcw className="size-4" />
            Reset to defaults
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="space-y-4 rounded-2xl border border-border bg-card p-5">
          <h2 className="font-heading text-lg font-bold text-foreground">Appearance</h2>
          <div className="grid grid-cols-3 gap-2">
            {themeOptions.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => setTheme(value)}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-xl border border-border p-3 text-sm transition-colors",
                  theme === value
                    ? "border-primary bg-[var(--lilac)] text-[var(--primary-deep)]"
                    : "text-muted-foreground hover:bg-muted"
                )}
              >
                <Icon className="size-5" />
                {label}
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-4 rounded-2xl border border-border bg-card p-5">
          <h2 className="font-heading text-lg font-bold text-foreground">
            Currency & locale
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <SelectField
              label="Display currency"
              id="currency"
              value={currency}
              onChange={setCurrency}
              options={currencyOptions}
            />
            <SelectField
              label="Locale"
              id="locale"
              value={locale}
              onChange={setLocale}
              options={localeOptions}
            />
          </div>
        </section>

        <section className="space-y-3 rounded-2xl border border-border bg-card p-5">
          <h2 className="font-heading text-lg font-bold text-foreground">Notifications</h2>
          {bankConfig.notificationPreferences.map((pref) => (
            <div
              key={pref.key}
              className="flex items-center justify-between gap-4 border-b border-border/60 pb-3 last:border-0 last:pb-0"
            >
              <div>
                <p className="text-sm font-semibold text-foreground">{pref.label}</p>
                <p className="text-xs text-muted-foreground">{pref.description}</p>
              </div>
              <Toggle
                checked={notifications[pref.key as keyof NotificationPrefs]}
                onChange={(v) =>
                  setNotification(pref.key as keyof NotificationPrefs, v)
                }
              />
            </div>
          ))}
        </section>

        <section className="space-y-3 rounded-2xl border border-border bg-card p-5">
          <h2 className="font-heading text-lg font-bold text-foreground">
            Privacy & security
          </h2>

          <div className="flex items-center justify-between gap-4 border-b border-border/60 pb-3">
            <div>
              <p className="text-sm font-semibold text-foreground">Hide balances</p>
              <p className="text-xs text-muted-foreground">
                Mask amounts across the dashboard.
              </p>
            </div>
            <Toggle
              checked={privacy.hideBalances}
              onChange={(v) => setPrivacy("hideBalances", v)}
            />
          </div>

          <div className="flex items-center justify-between gap-4 border-b border-border/60 pb-3">
            <div>
              <p className="text-sm font-semibold text-foreground">Biometric lock</p>
              <p className="text-xs text-muted-foreground">
                Require device unlock when opening the app.
              </p>
            </div>
            <Toggle
              checked={privacy.biometricLock}
              onChange={(v) => setPrivacy("biometricLock", v)}
            />
          </div>

          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-foreground">Idle timeout</p>
              <p className="text-xs text-muted-foreground">
                Sign out after a period of inactivity.
              </p>
            </div>
            <Select
              value={String(privacy.idleTimeoutMinutes)}
              onValueChange={(v) =>
                setPrivacy("idleTimeoutMinutes", Number.parseInt(v ?? "0", 10))
              }
            >
              <SelectTrigger className="h-8 w-40">
                <SelectValue placeholder="Never" />
              </SelectTrigger>
              <SelectContent>
                {bankConfig.idleTimeoutOptions.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </section>
      </div>
    </div>
  );
}

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative h-6 w-11 shrink-0 rounded-full transition-colors",
        checked ? "bg-primary" : "bg-muted-foreground/30"
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 left-0.5 size-5 rounded-full bg-white shadow transition-transform",
          checked && "translate-x-5"
        )}
      />
    </button>
  );
}
