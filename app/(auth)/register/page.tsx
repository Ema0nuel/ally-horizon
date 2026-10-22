"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { AuthShell } from "@/components/auth/auth-shell";
import { CaptchaWidget } from "@/components/auth/captcha-widget";
import { PasswordInput, inputClass } from "@/components/auth/password-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { COUNTRIES, COUNTRY_CODES } from "@/lib/countries";
import { signupUser } from "@/lib/auth";

const labelClass =
  "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground";

const sectionClass =
  "col-span-1 font-heading text-lg font-bold text-primary md:col-span-2";

const submitBtnClass =
  "inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-8 text-sm font-semibold text-[var(--accent-foreground)] transition-all hover:bg-[var(--accent)]/90 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 md:w-auto md:px-10";

const titles = ["Mr.", "Mrs.", "Ms.", "Dr.", "Barr."];

const accountTypes = [
  "USD SAVING",
  "USD CURRENT",
  "MONEY MARKET",
  "IRA",
  "INVESTMENT ACCOUNT",
];

export default function RegisterPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [country, setCountry] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaKey, setCaptchaKey] = useState(0);

  function resetCaptcha() {
    setCaptchaToken(null);
    setCaptchaKey((k) => k + 1);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const form = e.currentTarget;
    const fd = new FormData(form);
    const data = Object.fromEntries(fd.entries()) as Record<string, string>;

    data.title = title;
    data.selectcountry = countryCode;
    data.country = country;

    const required = [
      "title",
      "firstname",
      "lastname",
      "selectcountry",
      "phone1",
      "email",
      "country",
      "uaddress",
      "city",
      "state",
      "zip",
      "dob",
      "occupation",
      "ssn",
      "marital",
      "gender",
      "acctype",
      "password",
    ];

    for (const key of required) {
      if (!data[key]) {
        setError("Please complete all required fields.");
        return;
      }
    }

    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/.test(data.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!form.checkValidity()) {
      setError("Please complete all required fields.");
      form.reportValidity();
      return;
    }

    if (!captchaToken) {
      setError("Please complete the captcha challenge.");
      return;
    }

    setLoading(true);
    try {
      const ip = await fetch("https://api.ipify.org?format=json")
        .then((r) => r.json())
        .then((d) => d.ip);

      await signupUser(
        {
          email: data.email,
          password: data.password,
          firstname: data.firstname,
          lastname: data.lastname,
          title: data.title,
          phone1: data.phone1,
          selectcountry: data.selectcountry,
          country: data.country,
          uaddress: data.uaddress,
          city: data.city,
          state: data.state,
          zip: data.zip,
          dob: data.dob,
          occupation: data.occupation,
          ssn: data.ssn,
          marital: data.marital,
          gender: data.gender,
          acctype: data.acctype,
        },
        ip,
        captchaToken
      );

      sessionStorage.setItem("pendingEmail", data.email);
      router.push("/auth");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed.");
      resetCaptcha();
      setLoading(false);
    }
  }

  return (
    <AuthShell
      title="Create your account"
      subtitle="Open an Ally account in minutes."
      footer={
        <p className="text-center font-sans text-sm font-semibold text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:underline">
            Log in
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error ? (
          <p className="rounded-xl border border-[var(--primary-deep)]/30 bg-[var(--primary-deep)]/10 px-4 py-3 font-sans text-sm font-semibold text-[var(--primary-deep)]">
            {error}
          </p>
        ) : null}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <h2 className={sectionClass}>Personal data</h2>

          <div>
            <label htmlFor="title" className={labelClass}>
              Title
            </label>
            <Select id="title" value={title} onValueChange={(v) => setTitle(v ?? "")}>
              <SelectTrigger className="h-11 rounded-xl">
                <SelectValue placeholder="Select title" />
              </SelectTrigger>
              <SelectContent>
                {titles.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label htmlFor="firstname" className={labelClass}>
              First name
            </label>
            <input id="firstname" name="firstname" className={inputClass} required />
          </div>

          <div>
            <label htmlFor="lastname" className={labelClass}>
              Last name
            </label>
            <input id="lastname" name="lastname" className={inputClass} required />
          </div>

          <div>
            <label htmlFor="selectcountry" className={labelClass}>
              Country code
            </label>
            <Select
              id="selectcountry"
              value={countryCode}
              onValueChange={(v) => setCountryCode(v ?? "")}
            >
              <SelectTrigger className="h-11 rounded-xl">
                <SelectValue placeholder="Select country code" />
              </SelectTrigger>
              <SelectContent>
                {COUNTRY_CODES.map((c) => (
                  <SelectItem key={c.code} value={c.code}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label htmlFor="phone1" className={labelClass}>
              Telephone
            </label>
            <input
              id="phone1"
              name="phone1"
              className={inputClass}
              placeholder="XXX XXX XXXX"
              pattern="[0-9 ]{5,15}"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className={labelClass}>
              Email address
            </label>
            <input id="email" name="email" type="email" className={inputClass} required />
          </div>

          <div>
            <label htmlFor="country" className={labelClass}>
              Nationality
            </label>
            <Select id="country" value={country} onValueChange={(v) => setCountry(v ?? "")}>
              <SelectTrigger className="h-11 rounded-xl">
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                {COUNTRIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="md:col-span-2">
            <label htmlFor="uaddress" className={labelClass}>
              Address
            </label>
            <input id="uaddress" name="uaddress" className={inputClass} required />
          </div>

          <div>
            <label htmlFor="city" className={labelClass}>
              City
            </label>
            <input id="city" name="city" className={inputClass} required />
          </div>

          <div>
            <label htmlFor="state" className={labelClass}>
              State
            </label>
            <input id="state" name="state" className={inputClass} required />
          </div>

          <div>
            <label htmlFor="zip" className={labelClass}>
              Zip code
            </label>
            <input id="zip" name="zip" className={inputClass} pattern="[0-9]{5,8}" required />
          </div>

          <div>
            <label htmlFor="dob" className={labelClass}>
              Date of birth
            </label>
            <input id="dob" name="dob" type="date" className={inputClass} required />
          </div>

          <div>
            <label htmlFor="occupation" className={labelClass}>
              Occupation
            </label>
            <input id="occupation" name="occupation" className={inputClass} required />
          </div>

          <div>
            <label htmlFor="ssn" className={labelClass}>
              SSN
            </label>
            <input id="ssn" name="ssn" className={inputClass} required />
          </div>

          <div className="md:col-span-2">
            <span className={labelClass}>Marital status</span>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {["Single", "Married", "Divorced", "Separated"].map((v) => (
                <label key={v} className="flex items-center gap-2 font-sans text-sm text-foreground">
                  <input type="radio" name="marital" value={v} className="accent-primary" required />
                  {v}
                </label>
              ))}
            </div>
          </div>

          <div className="md:col-span-2">
            <span className={labelClass}>Gender</span>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {["Male", "Female", "Rather not say"].map((v) => (
                <label key={v} className="flex items-center gap-2 font-sans text-sm text-foreground">
                  <input type="radio" name="gender" value={v} className="accent-primary" required />
                  {v}
                </label>
              ))}
            </div>
          </div>

          <div className="md:col-span-2">
            <span className={labelClass}>Account type</span>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {accountTypes.map((v) => (
                <label key={v} className="flex items-center gap-2 font-sans text-sm text-foreground">
                  <input type="radio" name="acctype" value={v} className="accent-primary" required />
                  {v}
                </label>
              ))}
            </div>
          </div>

          <div className="md:col-span-2">
            <PasswordInput
              id="password"
              label="Password"
              value={password}
              onChange={setPassword}
              showStrength
              autoComplete="new-password"
            />
          </div>

          <div className="md:col-span-2">
            <label className="flex items-start gap-2 font-sans text-sm text-muted-foreground">
              <input type="checkbox" className="mt-0.5 accent-primary" required />
              <span>
                I accept the{" "}
                <Link href="/terms" className="text-primary hover:underline">
                  terms
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-primary hover:underline">
                  privacy policy
                </Link>
              </span>
            </label>
          </div>

          <div className="md:col-span-2">
            <CaptchaWidget key={`cap-${captchaKey}`} onToken={setCaptchaToken} />
          </div>

          <div className="md:col-span-2 flex justify-end">
            <button type="submit" disabled={loading} className={submitBtnClass}>
              {loading ? "Creating account..." : "Sign up"}
            </button>
          </div>
        </div>
      </form>
    </AuthShell>
  );
}
