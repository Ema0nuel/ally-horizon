import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, HandCoins, House, Users } from "lucide-react";

import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { PageHero } from "@/components/site/page-hero";
import { buttonVariants } from "@/components/ui/button";
import { buildMetadata } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Switch to Ally",
  description:
    "Moving to Ally is easier than ever. Refinance your home loan, switch your transaction account, and join millions of customers enjoying competitive rates.",
  path: "/switch",
});

const stats = [
  { icon: Users, label: "Caring for 1.9 million customers" },
  { icon: HandCoins, label: "$272 million reinvested back into local communities" },
  { icon: House, label: "The nation's most satisfied home loan customers*" },
];

const exploreTiles = [
  {
    title: "Owner occupied variable",
    subtitle: "Express Home Loan",
    img: "https://images.unsplash.com/photo-1565688534245-05d6b5be184a?auto=format&fit=crop&w=1200&q=80",
    description:
      "Combines fast online approval with a competitive interest rate and flexible terms.",
    rate: "4.97%",
    comparison: "5.12%",
  },
  {
    title: "Owner occupied variable",
    subtitle: "Complete Home Loan",
    img: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&w=1200&q=80",
    description:
      "Get the flexibility you want, with the features and benefits you need.",
    rate: "5.44%",
    comparison: "5.67%",
  },
  {
    title: "Investment variable",
    subtitle: "Complete Home Loan",
    img: "https://images.unsplash.com/photo-1503594384566-461fe158e797?auto=format&fit=crop&w=1200&q=80",
    description: "Flexible terms for your investment property.",
    rate: "5.69%",
    comparison: "5.92%",
  },
];

const numberedTiles = [
  "Speak to our lending specialists who'll be able to guide you through the process and discuss which home loan best suits your needs.",
  "Do you want to bring your everyday banking or credit cards with you? We can help you start this process.",
  "Once you've decided on the loan that best suits you we'll get to work and do all the heavy lifting for you.",
];

const categoryTiles = [
  {
    title: "Complete Home Loan",
    href: "/personal",
    img: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Express Home Loan",
    href: "/personal",
    img: "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Home Insurance",
    href: "/personal",
    img: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Credit Cards",
    href: "/personal",
    img: "https://images.unsplash.com/photo-1614027164847-1b28cfe1df60?auto=format&fit=crop&w=1200&q=80",
  },
];

const refinanceChecks = [
  "Offset available on variable and fixed loans",
  "Access additional repayments using online redraw",
  "Apply online - full online experience",
];

export default function SwitchPage() {
  return (
    <>
      <PageHero
        title="Moving to Ally is easier than ever"
        subtitle="Refinance with a bank you can feel better about and join 1.9 million customers already benefiting from our competitive rates and trusted services."
        image="https://images.unsplash.com/photo-1623282033815-40b05d96c903?auto=format&fit=crop&w=1200&q=80"
        showLogo
      />

      <section className="border-b border-border bg-muted">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-center gap-6 px-6 py-8 md:flex-row md:gap-10">
          {stats.map((stat) => (
            <div key={stat.label} className="flex items-center gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-card shadow-sm">
                <stat.icon className="size-5 text-primary" strokeWidth={1.5} />
              </span>
              <span className="text-base font-semibold text-foreground">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "Switch now" }]}
      />

      <section className="py-16">
        <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-10 px-6 md:grid-cols-2">
          <Image
            src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80"
            alt="Refinance your home loan"
            width={800}
            height={600}
            className="w-full rounded-xl object-cover shadow-lg"
          />
          <div>
            <h2 className="text-balance text-3xl tracking-[-0.03em] text-foreground md:text-4xl">
              Refinance your home loan
            </h2>
            <div className="mt-6 flex flex-col gap-4 md:flex-row">
              <div className="flex-1 rounded-2xl border border-border bg-card p-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-semibold tracking-tight text-foreground">
                    4.97%
                  </span>
                  <span className="text-sm text-muted-foreground">p.a.</span>
                </div>
                <div className="mt-1 text-sm text-muted-foreground">
                  Variable rate
                </div>
              </div>
              <div className="flex-1 rounded-2xl border border-border bg-card p-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-semibold tracking-tight text-foreground">
                    5.12%
                  </span>
                  <span className="text-sm text-muted-foreground">p.a.</span>
                </div>
                <div className="mt-1 text-sm text-muted-foreground">
                  Comparison rate
                </div>
              </div>
            </div>
            <ul className="mt-6 space-y-2">
              {refinanceChecks.map((check) => (
                <li key={check} className="flex items-center gap-2">
                  <Check className="size-4 text-primary" strokeWidth={2} />
                  <span className="text-sm">{check}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-col gap-4 md:flex-row">
              <Link
                href="/personal"
                className={buttonVariants({
                  className:
                    "h-11 rounded-full px-6 bg-[var(--primary)] text-white hover:bg-[var(--primary-deep)] border-transparent font-semibold",
                })}
              >
                Learn more
              </Link>
              <Link
                href="/personal/enquiry"
                className={buttonVariants({
                  className:
                    "h-11 rounded-full px-6 bg-[var(--accent)] text-[var(--accent-foreground)] hover:bg-[var(--accent)] hover:opacity-90 font-semibold",
                })}
              >
                Check my eligibility
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-muted py-16">
        <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-10 px-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <h2 className="text-balance text-3xl tracking-[-0.03em] text-foreground md:text-4xl">
              Great reasons to refinance your home loan with Ally
            </h2>
            <p className="mt-4 text-muted-foreground">
              Our competitive rates, simplified home loan products, and
              personalized customer service. Just some of the reasons why our
              customers choose to bank with us. We&apos;re also one of the
              nation&apos;s most trusted brands.
            </p>
            <p className="mt-4 text-muted-foreground">
              See for yourself when you switch your home loan to Ally, the
              better big bank.
            </p>
            <Link
              href="/personal/enquiry"
              className={buttonVariants({
                className:
                  "mt-6 h-11 rounded-full px-6 bg-[var(--accent)] text-[var(--accent-foreground)] hover:bg-[var(--accent)] hover:opacity-90 font-semibold",
              })}
            >
              Make an enquiry
            </Link>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6">
            <h3 className="font-heading text-lg font-medium text-foreground">
              Move other banking
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Also interested in moving your other banking to us? Learn how to
              easily switch your transaction account or personal loan today.
            </p>
            <div className="mt-4 flex flex-col gap-2">
              <Link
                href="/login"
                className={buttonVariants({
                  className:
                    "h-11 rounded-full bg-[var(--primary)] text-white hover:bg-[var(--primary-deep)] border-transparent font-semibold",
                })}
              >
                Transaction account
              </Link>
              <Link
                href="/login"
                className={buttonVariants({
                  className:
                    "h-11 rounded-full bg-[var(--primary)] text-white hover:bg-[var(--primary-deep)] border-transparent font-semibold",
                })}
              >
                Personal loan
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto w-full max-w-6xl px-6">
          <h2 className="text-balance text-center text-3xl tracking-[-0.03em] text-foreground md:text-4xl">
            Great loans for you
          </h2>
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {exploreTiles.map((tile) => (
              <article
                key={`${tile.title}-${tile.subtitle}-${tile.rate}`}
                className="card-hover flex flex-col rounded-2xl border border-border bg-card p-6"
              >
                <Image
                  src={tile.img}
                  alt={tile.title}
                  width={600}
                  height={400}
                  className="mb-4 h-40 w-full rounded-lg object-cover"
                />
                <h3 className="font-heading text-lg font-medium text-foreground">
                  {tile.title}
                </h3>
                <p className="mt-1 text-sm font-semibold text-primary">
                  {tile.subtitle}
                </p>
                <p className="mt-3 text-sm text-muted-foreground">
                  {tile.description}
                </p>
                <div className="mt-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-semibold tracking-tight text-foreground">
                      {tile.rate}
                    </span>
                    <span className="text-sm text-muted-foreground">p.a.</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Comparison rate:{" "}
                    <span className="font-semibold">{tile.comparison}</span>{" "}
                    p.a.
                  </div>
                </div>
                <div className="mt-6 flex flex-col gap-2">
                  <Link
                    href="/personal"
                    className={buttonVariants({
                      className:
                        "h-10 rounded-full bg-[var(--primary)] text-white hover:bg-[var(--primary-deep)] border-transparent font-semibold",
                    })}
                  >
                    Learn more
                  </Link>
                  <Link
                    href="/personal/enquiry"
                    className={buttonVariants({
                      className:
                        "h-10 rounded-full bg-[var(--accent)] text-[var(--accent-foreground)] hover:bg-[var(--accent)] hover:opacity-90 font-semibold",
                    })}
                  >
                    Check my eligibility
                  </Link>
                </div>
              </article>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/personal"
              className={buttonVariants({
                className:
                  "h-11 rounded-full px-6 bg-[var(--primary)] text-white hover:bg-[var(--primary-deep)] border-transparent font-semibold",
              })}
            >
              View all home loan rates
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-muted py-16">
        <div className="mx-auto w-full max-w-6xl px-6">
          <h2 className="text-balance text-3xl tracking-[-0.03em] text-foreground md:text-4xl">
            Explore how to switch to Ally
          </h2>
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
            {numberedTiles.map((text, i) => (
              <div
                key={text}
                className="flex flex-col items-center rounded-2xl border border-border bg-card p-6 text-center"
              >
                <div className="grid size-12 place-items-center rounded-full bg-primary text-2xl font-bold text-white">
                  {i + 1}
                </div>
                <p className="mt-4 font-semibold text-foreground">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto w-full max-w-6xl px-6">
          <h2 className="text-balance text-center text-3xl tracking-[-0.03em] text-foreground md:text-4xl">
            You may also be interested in
          </h2>
          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {categoryTiles.map((tile) => (
              <Link
                key={tile.title}
                href={tile.href}
                className="card-hover flex flex-col rounded-2xl border border-border bg-card"
              >
                <Image
                  src={tile.img}
                  alt={tile.title}
                  width={600}
                  height={400}
                  className="h-32 w-full rounded-t-2xl object-cover"
                />
                <div className="flex flex-1 flex-col justify-between p-4">
                  <h3 className="font-heading text-lg font-medium text-foreground">
                    {tile.title}
                  </h3>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                    Learn more
                    <ArrowRight className="size-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
