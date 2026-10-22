import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  CloudLightning,
  CreditCard,
  Ellipsis,
  HeartHandshake,
  HandCoins,
  IdCard,
  Key,
  Laptop,
  Link2,
  Mail,
  MapPin,
  Phone,
  Settings,
  ShieldCheck,
} from "lucide-react";

import { PageHero } from "@/components/site/page-hero";
import { buildMetadata, siteConfig } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Support Centre",
  description:
    "Providing help and support when you need it. Find popular links, e-banking help, security guidance, and ways to contact the Ally support team.",
  path: "/support",
});

const quickTiles = [
  { icon: Link2, label: "Popular links", href: "#popularlinks" },
  { icon: Laptop, label: "e-banking help", href: "#ebanking" },
  { icon: HeartHandshake, label: "We're here for you", href: "#hereforyou" },
  { icon: Settings, label: "Manage your banking", href: "#manage" },
  { icon: Ellipsis, label: "Other support topics", href: "#contact" },
];

const popularLinks = [
  { icon: IdCard, label: "Find my e-banking Access ID" },
  { icon: Key, label: "Reset my e-banking password" },
  { icon: Mail, label: "Update my postal address" },
  { icon: CreditCard, label: "Report a lost or stolen card" },
];

const supportTopics = [
  { icon: HeartHandshake, label: "Vulnerable customers", href: "/about" },
  {
    icon: HandCoins,
    label: "Financial difficulty assistance",
    href: "/financial-difficulty",
  },
  {
    icon: CloudLightning,
    label: "Natural disaster assistance",
    href: "/about",
  },
  { icon: ShieldCheck, label: "Financial abuse", href: "/financial-abuse" },
  { icon: HeartHandshake, label: "COVID-19 hub", href: "/about" },
];

const manageCards = [
  {
    title: "Products",
    desc: "Helping you to manage your products.",
    img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=1200&q=80",
    links: ["Home loans", "Credit and debit cards", "Business cards"],
  },
  {
    title: "Security",
    desc: "Keeping you and your family safe.",
    img: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1200&q=80",
    links: ["Scam alerts", "Identity theft", "General security"],
  },
  {
    title: "Ways to bank",
    desc: "Supporting you to bank the way you want.",
    img: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&q=80",
    links: ["Internet banking", "All ways to bank"],
  },
];

export default function SupportPage() {
  return (
    <>
      <PageHero
        title="Support centre"
        subtitle="Providing help and support when you need it."
        image="https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=1200&q=80"
      />

      <section className="border-b border-border bg-muted py-10">
        <div className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-4 px-6 md:grid-cols-5">
          {quickTiles.map((tile) => (
            <Link
              key={tile.label}
              href={tile.href}
              className="flex flex-col items-center rounded-2xl border border-border bg-card p-4 shadow-sm transition-colors hover:bg-muted"
            >
              <tile.icon className="mb-2 size-6 text-primary" strokeWidth={1.5} />
              <span className="text-center text-sm font-semibold">
                {tile.label}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section id="popularlinks" className="scroll-mt-24 py-14">
        <div className="mx-auto w-full max-w-6xl px-6">
          <h2 className="text-2xl tracking-tight text-foreground md:text-3xl">
            Popular links
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
            {popularLinks.map((link) => (
              <Link
                key={link.label}
                href="/login"
                className="flex items-center rounded-lg border border-border bg-card p-4 transition-colors hover:bg-muted"
              >
                <link.icon className="mr-4 size-6 text-primary" strokeWidth={1.5} />
                <span className="text-sm">{link.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-muted py-12">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-6 px-6 md:flex-row md:items-center">
          <h2 className="max-w-2xl text-balance text-2xl tracking-tight text-foreground md:text-3xl">
            Scams are on the rise so it&apos;s never been more important to know
            how to spot a scam.
          </h2>
          <Link
            href="/security"
            className="rounded-full bg-[var(--accent)] px-6 py-3 text-base font-semibold text-[var(--accent-foreground)] transition-colors hover:bg-[var(--accent)] hover:opacity-90"
          >
            Learn how to spot a scam
          </Link>
        </div>
      </section>

      <section id="ebanking" className="scroll-mt-24 py-14">
        <div className="mx-auto w-full max-w-6xl px-6">
          <h2 className="text-2xl tracking-tight text-foreground md:text-3xl">
            e-banking support
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="font-heading text-xl font-medium text-foreground">
                Getting started
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Everything you need to know when getting started.
              </p>
              <ul className="mt-4">
                <li>
                  <Link href="/login" className="text-primary hover:underline">
                    Accessing e-banking
                  </Link>
                </li>
              </ul>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="font-heading text-xl font-medium text-foreground">
                Managing my accounts
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Tips on managing your accounts to get the most out of e-banking.
              </p>
              <ul className="mt-4 space-y-1">
                <li>
                  <Link href="/login" className="text-primary hover:underline">
                    Account management
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="text-primary hover:underline">
                    e-statements
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 flex flex-col justify-center gap-4 md:flex-row">
            <Link
              href="/login"
              className="rounded-full bg-[var(--primary)] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--primary-deep)]"
            >
              e-banking troubleshooting
            </Link>
            <Link
              href="/contact-us"
              className="rounded-full bg-[var(--primary)] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--primary-deep)]"
            >
              e-banking feedback
            </Link>
          </div>
        </div>
      </section>

      <section
        id="hereforyou"
        className="scroll-mt-24 border-y border-border bg-muted py-14"
      >
        <div className="mx-auto w-full max-w-6xl px-6">
          <h2 className="text-2xl tracking-tight text-foreground md:text-3xl">
            We&apos;re here for you
          </h2>
          <div className="mt-6 grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-5">
            {supportTopics.map((topic) => (
              <Link
                key={topic.label}
                href={topic.href}
                className="flex flex-col items-center rounded-2xl border border-border bg-card p-4 shadow-sm transition-colors hover:bg-muted"
              >
                <topic.icon className="mb-2 size-6 text-primary" strokeWidth={1.5} />
                <span className="text-center text-sm font-semibold">
                  {topic.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="manage" className="scroll-mt-24 py-14">
        <div className="mx-auto w-full max-w-6xl px-6">
          <h2 className="text-2xl tracking-tight text-foreground md:text-3xl">
            Manage your banking
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-3">
            {manageCards.map((card) => (
              <div
                key={card.title}
                className="overflow-hidden rounded-2xl border border-border bg-card"
              >
                <Image
                  src={card.img}
                  alt=""
                  width={600}
                  height={400}
                  className="h-40 w-full object-cover"
                />
                <div className="p-6">
                  <h3 className="font-heading text-xl font-medium text-foreground">
                    {card.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {card.desc}
                  </p>
                  <ul className="mt-4 space-y-1">
                    {card.links.map((link) => (
                      <li key={link}>
                        <Link
                          href="/login"
                          className="text-primary hover:underline"
                        >
                          {link}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="scroll-mt-24 border-t border-border bg-muted py-14">
        <div className="mx-auto w-full max-w-6xl px-6">
          <h2 className="text-2xl tracking-tight text-foreground md:text-3xl">
            Contact us
          </h2>
          <div className="mt-6 flex flex-col gap-4 md:flex-row">
            <Link
              href="/contact-us"
              className="flex items-center rounded-lg border border-border bg-card p-4 transition-colors hover:bg-muted"
            >
              <Mail className="mr-4 size-6 text-primary" strokeWidth={1.5} />
              <span className="font-semibold">Online</span>
            </Link>
            <Link
              href="/locate"
              className="flex items-center rounded-lg border border-border bg-card p-4 transition-colors hover:bg-muted"
            >
              <MapPin className="mr-4 size-6 text-primary" strokeWidth={1.5} />
              <span className="font-semibold">Find a branch</span>
            </Link>
            <a
              href={`tel:${siteConfig.phoneHref}`}
              className="flex items-center rounded-lg border border-border bg-card p-4 transition-colors hover:bg-muted"
            >
              <Phone className="mr-4 size-6 text-primary" strokeWidth={1.5} />
              <span className="font-semibold">Call us</span>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
