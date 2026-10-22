"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Status = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    if (
      !String(data.get("name") ?? "").trim() ||
      !String(data.get("email") ?? "").trim() ||
      !String(data.get("message") ?? "").trim()
    ) {
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
      <div className="space-y-1.5">
        <label htmlFor="name" className="text-sm font-semibold">
          Name
        </label>
        <Input
          id="name"
          name="name"
          type="text"
          required
          className="h-10"
        />
      </div>
      <div className="space-y-1.5">
        <label htmlFor="email" className="text-sm font-semibold">
          Email
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          className="h-10"
        />
      </div>
      <div className="space-y-1.5">
        <label htmlFor="phone" className="text-sm font-semibold">
          Phone
        </label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          placeholder="Optional"
          className="h-10"
        />
      </div>
      <div className="space-y-1.5">
        <label htmlFor="message" className="text-sm font-semibold">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          required
          className="w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-base text-foreground outline-none focus-visible:border-ring md:text-sm"
        />
      </div>

      {status === "error" && (
        <p className="text-sm font-semibold text-danger" role="alert">
          Please fill in all required fields.
        </p>
      )}
      {status === "success" && (
        <p className="text-sm font-semibold text-success" role="status">
          Your message has been sent!
        </p>
      )}

      <Button
        type="submit"
        disabled={status === "submitting"}
        className="h-11 rounded-full px-6 bg-[var(--accent)] text-[var(--accent-foreground)] hover:bg-[var(--accent)] hover:opacity-90 font-semibold"
      >
        {status === "submitting" ? "Sending…" : "Send Message"}
      </Button>
    </form>
  );
}
