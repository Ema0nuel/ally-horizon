"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Status = "idle" | "submitting" | "success" | "error";

const helpOptions = [
  "I've found my dream home, all I need is a loan",
  "I want to switch my loan over to Ally",
  "I'm actively house hunting",
  "I'd like to review my current loan and offset account",
  "I'm just starting out and need some advice",
];

export function EnquiryForm() {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    const required = ["firstName", "lastName", "phone", "email", "postcode"];
    if (required.some((key) => !String(data.get(key) ?? "").trim())) {
      setStatus("error");
      return;
    }

    setStatus("submitting");
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setStatus("success");
    form.reset();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-2xl border border-border bg-card p-6"
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="firstName" className="text-sm font-semibold">
            First name
          </label>
          <Input
            id="firstName"
            name="firstName"
            type="text"
            required
            placeholder="Your first name"
            className="h-10"
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="lastName" className="text-sm font-semibold">
            Last name
          </label>
          <Input
            id="lastName"
            name="lastName"
            type="text"
            required
            placeholder="Your last name"
            className="h-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="phone" className="text-sm font-semibold">
            Phone number
          </label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            required
            placeholder="Example: 0400 123 456"
            className="h-10"
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-sm font-semibold">
            Email address
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            placeholder="Example: you@email.com"
            className="h-10"
          />
        </div>
      </div>

      <fieldset className="space-y-1.5">
        <legend className="text-sm font-semibold">
          Preferred contact method
        </legend>
        <div className="flex gap-6">
          <label className="inline-flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="contactMethod"
              value="Phone"
              defaultChecked
              className="accent-[var(--primary)]"
            />
            Phone
          </label>
          <label className="inline-flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="contactMethod"
              value="Email"
              className="accent-[var(--primary)]"
            />
            Email
          </label>
        </div>
      </fieldset>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="postcode" className="text-sm font-semibold">
            Postcode
          </label>
          <Input
            id="postcode"
            name="postcode"
            type="text"
            required
            placeholder="Example: 3550"
            maxLength={4}
            className="h-10"
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="helpWith" className="text-sm font-semibold">
            What can we help you with?
          </label>
          <Select id="helpWith" name="helpWith">
            <SelectTrigger>
              <SelectValue placeholder="Select option" />
            </SelectTrigger>
            <SelectContent>
              {helpOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {status === "error" && (
        <p className="text-sm font-semibold text-danger" role="alert">
          Please fill in all required fields.
        </p>
      )}
      {status === "success" && (
        <p className="text-sm font-semibold text-success" role="status">
          Your enquiry has been submitted!
        </p>
      )}

      <Button
        type="submit"
        disabled={status === "submitting"}
        className="h-11 rounded-full px-6 bg-[var(--accent)] text-[var(--accent-foreground)] hover:bg-[var(--accent)] hover:opacity-90 font-semibold"
      >
        {status === "submitting" ? "Submitting…" : "Submit"}
      </Button>
    </form>
  );
}
