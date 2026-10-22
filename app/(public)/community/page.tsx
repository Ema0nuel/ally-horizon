import type { Metadata } from "next";
import Link from "next/link";
import {
  Building2,
  GraduationCap,
  HandCoins,
  HeartPulse,
  Landmark,
  Leaf,
  Palette,
  Trophy,
  Truck,
} from "lucide-react";

import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { PageHero } from "@/components/site/page-hero";
import { buttonVariants } from "@/components/ui/button";
import { buildMetadata } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Community",
  description:
    "Be part of the Ally community. Through our profit-with-purpose model, we return profits directly to the communities that generate them.",
  path: "/community",
});

const propositions = [
  { icon: HandCoins, label: "$292 million reinvested back into local communities" },
  { icon: Building2, label: "Over 300 Community Bank branches" },
  { icon: Landmark, label: "One of the nation's biggest financial groups" },
];

const stats = [
  { icon: Trophy, value: "$4.6m", desc: "towards sport & recreation" },
  { icon: Landmark, value: "$4.1m", desc: "towards facilities & infrastructure" },
  { icon: GraduationCap, value: "$3.6m", desc: "towards education & research" },
  { icon: HeartPulse, value: "$3m", desc: "towards health & wellbeing" },
  { icon: Palette, value: "$2.9m", desc: "towards art, culture & heritage" },
  { icon: Leaf, value: "$300k", desc: "towards environment & animal welfare" },
  { icon: Truck, value: "$600k", desc: "towards emergency services & support" },
];

export default function CommunityPage() {
  return (
    <>
      <PageHero title="Be part of the Ally community" align="left">
        <Link
          href="/locate"
          className={buttonVariants({
            className:
              "mt-2 h-12 rounded-full px-8 text-base bg-[var(--accent)] text-[var(--accent-foreground)] hover:bg-[var(--accent)] hover:opacity-90 font-semibold",
          })}
        >
          Find a branch
        </Link>
      </PageHero>

      <section className="border-b border-border bg-muted">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-center gap-6 px-6 py-8 md:flex-row md:gap-10">
          {propositions.map((prop) => (
            <div key={prop.label} className="flex items-center gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-card shadow-sm">
                <prop.icon className="size-5 text-primary" strokeWidth={1.5} />
              </span>
              <span className="text-base font-semibold text-foreground">
                {prop.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "Community" }]}
      />

      <section className="py-16">
        <div className="mx-auto w-full max-w-6xl px-6">
          <h2 className="max-w-3xl text-balance text-3xl tracking-[-0.03em] text-foreground md:text-4xl">
            Every day our customers help change and save lives, simply by
            banking with us.
          </h2>
          <p className="mt-4 max-w-3xl text-muted-foreground">
            Community banking is based on a &apos;profit-with-purpose&apos;
            model, which means our profits are returned directly to the
            community that has generated them.
          </p>
        </div>
      </section>

      <section className="border-y border-border bg-muted py-16">
        <div className="mx-auto w-full max-w-6xl px-6">
          <h2 className="text-2xl tracking-tight text-foreground md:text-3xl">
            This year contributions included
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.desc}
                className="flex flex-col items-center rounded-2xl border border-border bg-card p-6 text-center"
              >
                <stat.icon className="mb-2 size-8 text-primary" strokeWidth={1.5} />
                <div className="text-2xl font-semibold tracking-tight text-foreground">
                  {stat.value}
                </div>
                <div className="mt-2 text-sm text-muted-foreground">
                  {stat.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative flex min-h-[220px] items-center overflow-hidden md:min-h-[320px]">
        <div
          aria-hidden
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80')",
          }}
        />
        <div aria-hidden className="absolute inset-0 bg-black/55 dark:bg-black/75" />
        <div className="relative z-10 mx-auto w-full max-w-4xl px-6 py-8">
          <div className="flex flex-col items-start gap-4">
            <h2 className="text-2xl font-extralight tracking-[-0.03em] text-white md:text-3xl">
              Switch to Ally
            </h2>
            <p className="max-w-xl text-white/90">
              Be part of something bigger. See below for more information about
              our in-person, phone, online or on the go services.
            </p>
            <Link
              href="/switch"
              className={buttonVariants({
                className:
                  "h-12 rounded-full px-8 text-base bg-[var(--accent)] text-[var(--accent-foreground)] hover:bg-[var(--accent)] hover:opacity-90 font-semibold",
              })}
            >
              Learn more
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
