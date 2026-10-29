"use client";

import type * as React from "react";
import { useRef, useState } from "react";
import Link from "next/link";
import { Camera, Loader2, LogOut, ShieldCheck } from "lucide-react";

import { bankConfig, type Option } from "@/lib/bank-config";
import { COUNTRIES } from "@/lib/countries";
import { getBrowserClient } from "@/lib/supabase/browser";
import { useAuthStore } from "@/stores/auth-store";
import { useMoney } from "@/hooks/use-preferences";
import { getInitials } from "@/lib/format";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/dashboard/field";
import { SelectField } from "@/components/dashboard/select-field";
import { PageHeader } from "@/components/dashboard/page-header";
import type { Account, Profile } from "@/components/dashboard/types";

const genderOptions: Option[] = ["Male", "Female", "Non-binary", "Prefer not to say"].map(
  (g) => ({ value: g, label: g })
);
const maritalOptions: Option[] = ["Single", "Married", "Divorced", "Widowed"].map((m) => ({
  value: m,
  label: m,
}));
const countryOptions: Option[] = COUNTRIES.map((c) => ({ value: c, label: c }));

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 5 * 1024 * 1024;

type Editable = {
  full_name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  dob: string;
  occupation: string;
  gender: string;
  marital_status: string;
  nationality: string;
};

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  const profile = useAuthStore((s) => s.profile) as Profile | null;
  const account = useAuthStore((s) => s.account) as Account | null;
  const setProfile = useAuthStore((s) => s.setProfile);
  const signOut = useAuthStore((s) => s.signOut);
  const { amount } = useMoney();

  const [form, setForm] = useState<Editable>(() => ({
    full_name: profile?.full_name ?? "",
    phone: profile?.phone ?? "",
    address: profile?.address ?? "",
    city: profile?.city ?? "",
    state: profile?.state ?? "",
    zip: profile?.zip ?? "",
    dob: profile?.dob ?? "",
    occupation: profile?.occupation ?? "",
    gender: profile?.gender ?? "",
    marital_status: profile?.marital_status ?? "",
    nationality: profile?.nationality ?? "",
  }));
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  function patchProfile(patch: object) {
    const current = useAuthStore.getState().profile ?? {};
    setProfile({ ...current, ...patch } as Record<string, unknown>);
  }

  function set<K extends keyof Editable>(key: K, value: Editable[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setSaved(false);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user?.id) return;
    setSaving(true);
    setError("");
    setSaved(false);

    const supabase = getBrowserClient();
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ ...form })
      .eq("id", user.id);

    if (updateError) {
      setError(updateError.message);
      setSaving(false);
      return;
    }

    patchProfile(form);
    setSaving(false);
    setSaved(true);
  }

  async function onAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !user?.id) return;

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError("Please choose a JPG, PNG, or WebP image.");
      return;
    }
    if (file.size > MAX_SIZE) {
      setError("Image must be under 5MB.");
      return;
    }

    setUploading(true);
    setError("");
    const supabase = getBrowserClient();
    const ext = file.name.split(".").pop() ?? "jpg";
    const path = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    const { error: upErr } = await supabase.storage
      .from(bankConfig.avatarBucket)
      .upload(path, file, { upsert: false, contentType: file.type });

    if (upErr) {
      setError(upErr.message);
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage
      .from(bankConfig.avatarBucket)
      .getPublicUrl(path);
    const url = urlData.publicUrl;

    const { error: dbErr } = await supabase
      .from("profiles")
      .update({ avatar_url: url })
      .eq("id", user.id);

    if (dbErr) {
      setError(dbErr.message);
      setUploading(false);
      return;
    }

    patchProfile({ avatar_url: url });
    setUploading(false);
  }

  const name = profile?.full_name ?? "Account holder";

  return (
    <div className="space-y-8">
      <PageHeader
        title="Profile"
        description="View your account details and update your personal information."
        crumbs={[{ label: "Profile" }]}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <section className="space-y-4 rounded-2xl border border-border bg-card p-5">
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="relative">
              <Avatar size="lg">
                {profile?.avatar_url && (
                  <AvatarImage src={profile.avatar_url} alt={name} />
                )}
                <AvatarFallback className="text-lg">
                  {getInitials(profile?.full_name ?? profile?.username ?? "")}
                </AvatarFallback>
              </Avatar>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                aria-label="Change profile picture"
                className="absolute -bottom-1 -right-1 flex size-7 items-center justify-center rounded-full border border-border bg-primary text-white shadow-sm transition-colors hover:bg-[var(--primary-deep)] disabled:opacity-60"
              >
                {uploading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Camera className="size-4" />
                )}
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={onAvatarChange}
              />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">{name}</p>
              <p className="text-xs text-muted-foreground">{profile?.email ?? ""}</p>
            </div>
          </div>

          <dl className="space-y-2 border-t border-border pt-4 text-sm">
            <InfoRow label="Balance" value={amount(account?.balance)} />
            <InfoRow
              label="Account number"
              value={account?.account_number ?? "—"}
              mono
            />
            <InfoRow label="Account type" value={account?.account_type ?? "—"} />
            <InfoRow
              label="Status"
              value={account?.is_active ? "Active" : "Inactive"}
            />
          </dl>

          <Link
            href="/dashboard/verification"
            className="flex items-center gap-3 rounded-xl border border-border p-3 transition-colors hover:border-primary/40 hover:bg-[var(--lilac)]/50"
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[var(--lilac)] text-[var(--primary-deep)]">
              <ShieldCheck className="size-5" />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-semibold text-foreground">
                Identity verification
              </span>
              <span className="block text-xs text-muted-foreground">
                Verify your identity
              </span>
            </span>
          </Link>
        </section>

        <form
          onSubmit={onSubmit}
          className="space-y-4 rounded-2xl border border-border bg-card p-5 lg:col-span-2"
        >
          <h2 className="font-heading text-lg font-medium text-foreground">
            Personal information
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Full name" htmlFor="full_name">
              <Input
                id="full_name"
                value={form.full_name}
                onChange={(e) => set("full_name", e.target.value)}
              />
            </Field>
            <Field label="Phone" htmlFor="phone">
              <Input
                id="phone"
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
              />
            </Field>
            <Field label="Date of birth" htmlFor="dob">
              <Input
                id="dob"
                type="date"
                value={form.dob}
                onChange={(e) => set("dob", e.target.value)}
              />
            </Field>
            <Field label="Occupation" htmlFor="occupation">
              <Input
                id="occupation"
                value={form.occupation}
                onChange={(e) => set("occupation", e.target.value)}
              />
            </Field>

            <SelectField
              label="Gender"
              id="gender"
              value={form.gender}
              onChange={(v) => set("gender", v)}
              options={genderOptions}
              placeholder="Select gender"
            />
            <SelectField
              label="Marital status"
              id="marital_status"
              value={form.marital_status}
              onChange={(v) => set("marital_status", v)}
              options={maritalOptions}
              placeholder="Select status"
            />

            <Field label="Address" htmlFor="address" className="sm:col-span-2">
              <Input
                id="address"
                value={form.address}
                onChange={(e) => set("address", e.target.value)}
              />
            </Field>
            <Field label="City" htmlFor="city">
              <Input
                id="city"
                value={form.city}
                onChange={(e) => set("city", e.target.value)}
              />
            </Field>
            <Field label="State / province" htmlFor="state">
              <Input
                id="state"
                value={form.state}
                onChange={(e) => set("state", e.target.value)}
              />
            </Field>
            <Field label="ZIP / postal code" htmlFor="zip">
              <Input
                id="zip"
                value={form.zip}
                onChange={(e) => set("zip", e.target.value)}
              />
            </Field>
            <SelectField
              label="Country"
              id="country"
              value={form.nationality}
              onChange={(v) => set("nationality", v)}
              options={countryOptions}
              placeholder="Select country"
            />
          </div>

          {error && <p className="text-xs text-[var(--primary-deep)]">{error}</p>}
          {saved && <p className="text-xs text-[var(--primary-deep)]">Profile updated.</p>}

          <div className="flex items-center justify-between pt-2">
            <a
              href={`mailto:${bankConfig.adminEmail}`}
              className="text-xs font-semibold text-primary hover:underline"
            >
              Contact support
            </a>
            <Button type="submit" disabled={saving}>
              {saving ? "Saving…" : "Save changes"}
            </Button>
          </div>
        </form>
      </div>

      <div className="lg:hidden">
        <Button
          type="button"
          variant="ghost"
          onClick={signOut}
          className="w-full justify-center gap-2 rounded-2xl border border-border text-primary-deep hover:text-primary-deep"
        >
          <LogOut className="size-5" />
          <span>Sign out</span>
        </Button>
      </div>
    </div>
  );
}

function InfoRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="shrink-0 text-muted-foreground">{label}</dt>
      <dd className={mono ? "break-all text-right font-mono text-xs" : "font-medium"}>
        {value}
      </dd>
    </div>
  );
}
