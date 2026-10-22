import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const columns = [
  {
    title: "Quick links",
    links: [
      { label: "Contact us", href: "/contact-us" },
      { label: "Locate a branch, ATM or Agency", href: "/locate" },
      { label: "Switch your banking to us", href: "/switch" },
    ],
  },
  {
    title: "About us",
    links: [
      { label: "About Ally", href: "/about" },
      { label: "Community", href: "/community" },
      { label: "Accessibility & Inclusion", href: "/accessibility" },
    ],
  },
  {
    title: "Help & support",
    links: [
      { label: "Financial abuse", href: "/financial-abuse" },
      {
        label: "Financial difficulty assistance",
        href: "/financial-difficulty",
      },
    ],
  },
];

const legal = [
  { label: "Terms of use", href: "/terms" },
  { label: "Important information", href: "/important-info" },
  { label: "Privacy", href: "/privacy" },
  { label: "Security", href: "/security" },
  { label: "Target Market Determinations", href: "/target-market" },
];

export function Footer() {
  const contactEmail = process.env.CONTACT_EMAIL;
  const year = new Date().getFullYear();

  return (
    <footer className="mt-8 border-t border-border bg-background">
      {/* CTA band */}
      <div className="border-b border-border">
        <div className="mx-auto flex w-full max-w-[1400px] flex-col items-start justify-between gap-8 px-6 py-20 md:px-12 lg:flex-row lg:items-center lg:px-16">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Ready when you are
            </p>
            <h2 className="max-w-xl text-balance text-3xl leading-[1.05] font-extralight tracking-[-0.03em] text-foreground md:text-5xl">
              Your financial future starts here.
            </h2>
          </div>
          <Link
            href="/register"
            className={buttonVariants({
              className:
                "h-12 shrink-0 rounded-full px-8 text-base bg-[var(--accent)] text-[var(--accent-foreground)] hover:bg-[var(--accent)] hover:opacity-90 font-semibold",
            })}
          >
            Open an account
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>

      {/* Main columns */}
      <div className="mx-auto grid w-full max-w-[1400px] grid-cols-1 gap-12 px-6 py-16 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] md:px-12 lg:px-16">
        <div className="max-w-sm">
          <Image
            src="/images/logo.png"
            alt="Ally logo"
            width={0}
            height={0}
            sizes="100vw"
            className="mb-4 h-10 w-auto dark:hidden"
          />
          <Image
            src="/images/logo.png"
            alt="Ally logo"
            width={0}
            height={0}
            sizes="100vw"
            className="mb-4 hidden h-10 w-auto dark:block"
          />
          <div className="mb-2 font-heading text-base font-bold text-primary">
            Ally
          </div>
          <p className="mb-8 text-sm text-muted-foreground">
            Empowering your financial future.
          </p>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            {contactEmail && (
              <a
                href={`mailto:${contactEmail}`}
                className="transition-colors hover:text-foreground"
              >
                <span className="font-semibold text-foreground">Email: </span>
                {contactEmail}
              </a>
            )}
            <a
              href="tel:+12102795532"
              className="transition-colors hover:text-foreground"
            >
              <span className="font-semibold text-foreground">Contact: </span>
              +1 (210) 279-5532
            </a>
          </div>
        </div>

        {columns.map((column) => (
          <div key={column.title}>
            <div className="mb-4 text-sm font-semibold text-primary">
              {column.title}
            </div>
            <ul className="space-y-3">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <Separator />

      <div className="mx-auto flex w-full max-w-[1400px] flex-col items-center justify-between gap-2 px-6 py-6 text-xs text-muted-foreground md:flex-row md:px-12 lg:px-16">
        <div>&copy; {year} Ally. All rights reserved.</div>
        <div className="flex flex-wrap gap-x-5 gap-y-2">
          {legal.map((item) => (
            <Link key={item.href} href={item.href} className="hover:underline">
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
