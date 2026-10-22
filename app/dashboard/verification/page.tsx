"use client";

import type * as React from "react";
import { useEffect, useRef, useState } from "react";
import { CheckCircle2, FileText, Loader2, Upload } from "lucide-react";

import { cn } from "@/lib/utils";
import { bankConfig } from "@/lib/bank-config";
import { getBrowserClient } from "@/lib/supabase/browser";
import { useAuthStore } from "@/stores/auth-store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/dashboard/field";
import { SelectField } from "@/components/dashboard/select-field";
import { PageHeader } from "@/components/dashboard/page-header";
import type { Profile } from "@/components/dashboard/types";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const ALLOWED_MIME: string[] = ["image/jpeg", "image/png", "image/webp"];
const EXT_BY_MIME: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

type DocumentKey = "primary_id_front" | "primary_id_back" | "selfie";
type DocumentLabel = "PRIMARY_FRONT" | "PRIMARY_BACK" | "SELFIE";

const DOCUMENTS: { key: DocumentKey; label: DocumentLabel; name: string }[] = [
  { key: "primary_id_front", label: "PRIMARY_FRONT", name: "ID front" },
  { key: "primary_id_back", label: "PRIMARY_BACK", name: "ID back" },
  { key: "selfie", label: "SELFIE", name: "Selfie" },
];

type Submission = {
  submission_status: string;
  rejection_reason: string | null;
  created_at: string | null;
};

export default function VerificationPage() {
  const user = useAuthStore((s) => s.user);
  const profile = useAuthStore((s) => s.profile) as Profile | null;

  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const [form, setForm] = useState(() => ({
    id_type: "",
    first_name: profile?.firstname ?? "",
    last_name: profile?.lastname ?? "",
    date_of_birth: profile?.dob ?? "",
    id_number: "",
    expiry_date: "",
    issuing_country: "",
  }));
  const [files, setFiles] = useState<Record<DocumentKey, File | null>>({
    primary_id_front: null,
    primary_id_back: null,
    selfie: null,
  });

  useEffect(() => {
    const userId = user?.id;
    if (!userId) return;
    let active = true;
    async function load() {
      const supabase = getBrowserClient();
      const { data } = await supabase
        .from("idme_submissions")
        .select("submission_status, rejection_reason, created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (active) {
        setSubmission((data as Submission) ?? null);
        setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [user?.id]);

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function setFile(key: DocumentKey, file: File | null) {
    setFiles((f) => ({ ...f, [key]: file }));
  }

  async function uploadDocument(
    userId: string,
    file: File,
    label: DocumentLabel
  ): Promise<string> {
    const supabase = getBrowserClient();
    const ext = EXT_BY_MIME[file.type] ?? "jpg";
    const filename = `${label}_${Date.now()}.${ext}`;
    const path = `${userId}/${filename}`;
    const { error } = await supabase.storage
      .from(bankConfig.idmeBucket)
      .upload(path, file, {
        upsert: false,
        contentType: file.type,
        cacheControl: "3600",
      });
    if (error) throw new Error(error.message);
    const { data } = supabase.storage.from(bankConfig.idmeBucket).getPublicUrl(path);
    return data.publicUrl;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user?.id) return;
    setError("");

    if (!form.id_type) {
      setError("Please select your ID type.");
      return;
    }
    if (!form.first_name.trim() || !form.last_name.trim()) {
      setError("First and last name are required.");
      return;
    }
    if (!form.date_of_birth) {
      setError("Date of birth is required.");
      return;
    }
    if (!form.id_number.trim()) {
      setError("ID number is required.");
      return;
    }
    if (!form.expiry_date) {
      setError("ID expiry date is required.");
      return;
    }
    const issuingCountry = form.issuing_country.trim().toUpperCase();
    if (!/^[A-Z]{2}$/.test(issuingCountry)) {
      setError("Issuing country must be a 2-letter code (e.g. US).");
      return;
    }

    for (const { key, name } of DOCUMENTS) {
      const file = files[key];
      if (!file) {
        setError(`Please upload your ${name.toLowerCase()}.`);
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        setError(`${name} must be under 5MB.`);
        return;
      }
      if (!ALLOWED_MIME.includes(file.type)) {
        setError(`${name} must be a JPG, PNG, or WebP image.`);
        return;
      }
    }

    setSubmitting(true);
    try {
      const [frontUrl, backUrl, selfieUrl] = await Promise.all([
        uploadDocument(user.id, files.primary_id_front as File, "PRIMARY_FRONT"),
        uploadDocument(user.id, files.primary_id_back as File, "PRIMARY_BACK"),
        uploadDocument(user.id, files.selfie as File, "SELFIE"),
      ]);

      const supabase = getBrowserClient();
      const { error: upsertError } = await supabase.from("idme_submissions").upsert(
        {
          user_id: user.id,
          id_type: form.id_type,
          first_name: form.first_name.trim(),
          last_name: form.last_name.trim(),
          date_of_birth: form.date_of_birth,
          id_number: form.id_number.trim(),
          expiry_date: form.expiry_date,
          issuing_country: issuingCountry,
          primary_id_front_url: frontUrl,
          primary_id_back_url: backUrl,
          selfie_url: selfieUrl,
          submission_status: "pending",
          submitted_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id,id_type" }
      );
      if (upsertError) throw new Error(upsertError.message);

      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="space-y-8">
        <PageHeader
          title="Identity verification"
          crumbs={[{ label: "Profile", href: "/dashboard/profile" }, { label: "Verification" }]}
        />
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-card px-6 py-14 text-center">
          <CheckCircle2 className="size-10 text-[var(--primary-deep)]" />
          <h2 className="font-heading text-xl font-bold text-foreground">
            Verification submitted
          </h2>
          <p className="max-w-sm text-sm text-muted-foreground">
            Your documents have been received and are being reviewed. We will notify you once
            your identity has been verified.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Identity verification"
        description="Verify your identity with ID.me by submitting your identification documents."
        crumbs={[{ label: "Profile", href: "/dashboard/profile" }, { label: "Verification" }]}
      />

      {!loading && submission && (
        <div
          className={cn(
            "flex items-center gap-3 rounded-2xl border p-4",
            submission.submission_status === "approved"
              ? "border-[var(--accent)]/40 bg-[var(--accent)]/15"
              : submission.submission_status === "rejected"
                ? "border-[var(--primary-deep)]/30 bg-[var(--primary-deep)]/10"
                : "border-border bg-card"
          )}
        >
          <Badge variant={statusTone(submission.submission_status)}>
            {submission.submission_status}
          </Badge>
          <p className="text-sm text-muted-foreground">
            {submission.submission_status === "rejected" && submission.rejection_reason
              ? submission.rejection_reason
              : "Your submission is being reviewed."}
          </p>
        </div>
      )}

      <form
        onSubmit={onSubmit}
        className="space-y-6 rounded-2xl border border-border bg-card p-5"
      >
        <div>
          <h2 className="font-heading text-lg font-medium text-foreground">
            Personal information
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <SelectField
              label="ID type"
              id="idme-idtype"
              value={form.id_type}
              onChange={(v) => set("id_type", v)}
              options={bankConfig.idmeIdTypes}
              placeholder="Select ID type"
              required
            />
            <Field label="ID number" htmlFor="idme-idnumber" required>
              <Input
                id="idme-idnumber"
                value={form.id_number}
                onChange={(e) => set("id_number", e.target.value)}
              />
            </Field>
            <Field label="First name" htmlFor="idme-firstname" required>
              <Input
                id="idme-firstname"
                value={form.first_name}
                onChange={(e) => set("first_name", e.target.value)}
              />
            </Field>
            <Field label="Last name" htmlFor="idme-lastname" required>
              <Input
                id="idme-lastname"
                value={form.last_name}
                onChange={(e) => set("last_name", e.target.value)}
              />
            </Field>
            <Field label="Date of birth" htmlFor="idme-dob" required>
              <Input
                id="idme-dob"
                type="date"
                value={form.date_of_birth}
                onChange={(e) => set("date_of_birth", e.target.value)}
              />
            </Field>
            <Field label="ID expiry date" htmlFor="idme-expiry" required>
              <Input
                id="idme-expiry"
                type="date"
                value={form.expiry_date}
                onChange={(e) => set("expiry_date", e.target.value)}
              />
            </Field>
            <Field
              label="Issuing country"
              htmlFor="idme-country"
              required
              hint="2-letter code (e.g. US, UK, NG)"
            >
              <Input
                id="idme-country"
                value={form.issuing_country}
                onChange={(e) => set("issuing_country", e.target.value.toUpperCase())}
                placeholder="US"
                maxLength={2}
              />
            </Field>
          </div>
        </div>

        <div>
          <h2 className="font-heading text-lg font-medium text-foreground">Documents</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Upload clear images of your ID (front and back) and a selfie. JPG, PNG, or WebP,
            up to 5MB each.
          </p>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {DOCUMENTS.map(({ key, name }) => (
              <DocumentUpload
                key={key}
                label={name}
                file={files[key]}
                onChange={(f) => setFile(key, f)}
              />
            ))}
          </div>
        </div>

        {error && <p className="text-xs text-[var(--primary-deep)]">{error}</p>}

        <Button type="submit" disabled={submitting}>
          {submitting && <Loader2 className="size-4 animate-spin" />}
          {submitting ? "Submitting…" : "Submit for verification"}
        </Button>
      </form>
    </div>
  );
}

function statusTone(status: string): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "approved":
      return "default";
    case "rejected":
      return "destructive";
    case "pending":
    case "under_review":
    case "manual_review":
      return "outline";
    default:
      return "secondary";
  }
}

function DocumentUpload({
  label,
  file,
  onChange,
}: {
  label: string;
  file: File | null;
  onChange: (file: File | null) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);

  return (
    <div>
      <p className="text-xs font-semibold text-muted-foreground">{label}</p>
      <button
        type="button"
        onClick={() => ref.current?.click()}
        className="mt-1.5 flex w-full flex-col items-center gap-2 rounded-xl border border-dashed border-border bg-muted/30 px-4 py-6 text-center transition-colors hover:border-primary/40 hover:bg-[var(--lilac)]/50"
      >
        {file ? (
          <>
            <FileText className="size-6 text-[var(--primary-deep)]" />
            <span className="truncate text-xs text-foreground">{file.name}</span>
          </>
        ) : (
          <>
            <Upload className="size-6 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Click to upload</span>
          </>
        )}
      </button>
      <input
        ref={ref}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => onChange(e.target.files?.[0] ?? null)}
      />
    </div>
  );
}
