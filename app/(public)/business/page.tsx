import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Banknote,
  CreditCard,
  Handshake,
  IdCard,
  Layers,
  Percent,
  Receipt,
  ShieldCheck,
  Truck,
} from "lucide-react";

import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { PageHero } from "@/components/site/page-hero";
import { buttonVariants } from "@/components/ui/button";
import { buildMetadata } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Business Banking",
  description:
    "Everything you need to make business banking easy. From loans and payments to equipment finance and insurance, discover business solutions tailored to your needs.",
  path: "/business",
});

const propositions = [
  { icon: Percent, label: "Competitive rates" },
  { icon: Layers, label: "Wide product range" },
  { icon: Handshake, label: "Banking made easy" },
];

const quickLinks = [
  { icon: Banknote, label: "Grow your business with a loan" },
  { icon: CreditCard, label: "Take and make payments" },
  { icon: Receipt, label: "Manage your business transactions" },
  { icon: Truck, label: "Purchase the equipment you need" },
  { icon: IdCard, label: "Credit and debit cards for your business" },
  { icon: ShieldCheck, label: "Protect against the unexpected" },
];

const highlights = [
  {
    title: "Managing your cash flow",
    img: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=80",
    desc: "Ensuring your day-to-day business details run smoothly, we offer a competitive range of transaction and savings accounts specifically designed to help you access your money and take care of business.",
  },
  {
    title: "Growing your business",
    img: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=1200&q=80",
    desc: "Big, small, established or new, if you need finance, we have a range of business and commercial loans to suit your unique needs.",
  },
  {
    title: "Trading with confidence",
    img: "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1200&q=80",
    desc: "We offer a range of other financial solutions to allow your business to run smoothly so that you can focus on growing your business and better service your customers.",
  },
  {
    title: "Operating internationally",
    img: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=1200&q=80",
    desc: "We provide secure solutions and competitive rates that allow you to transfer funds or travel overseas with confidence.",
  },
  {
    title: "Building wealth",
    img: "https://images.unsplash.com/photo-1579621970795-87facc2f976d?auto=format&fit=crop&w=1200&q=80",
    desc: "Super that's good for you and your employees. GroupSmartStart Super is a low cost, easy to use superannuation solution designed to keep things simple for you and your employees.",
  },
  {
    title: "Protecting my assets",
    img: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=1200&q=80",
    desc: "We offer a comprehensive range of commercial insurance solutions across business, farm and trade activities.",
  },
];

const profiles = [
  {
    title: "Tips on how you can better manage cash flow",
    img: "https://images.unsplash.com/photo-1554224154-26032ffc0d07?auto=format&fit=crop&w=1200&q=80",
    desc: "What's the number one issue keeping business owners up at night? Cash flow. Put simply, having money in the bank to cover your business expenses.",
  },
  {
    title: "How to borrow to grow your business",
    img: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80",
    desc: "The thought of growing your business can be daunting. The good news is there are so many options available so you can tailor finance to suit you.",
  },
  {
    title: "Economic update with David Robertson",
    img: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80",
    desc: "David Robertson, Head of Economic and Markets Research provides a monthly update on the economy and market, with the latest news and views on our domestic economy and interest rates.",
  },
];

export default function BusinessPage() {
  return (
    <>
      <PageHero
        title="Your business matters"
        subtitle="Everything you need to make business banking easy."
        image="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80"
      />

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
        items={[{ label: "Home", href: "/" }, { label: "Business" }]}
      />

      <section className="py-14">
        <div className="mx-auto w-full max-w-6xl px-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
            {quickLinks.map((link) => (
              <div
                key={link.label}
                className="flex flex-col items-center rounded-lg border border-border bg-card p-4 text-center transition-colors hover:bg-muted"
              >
                <link.icon className="mb-2 size-7 text-primary" strokeWidth={1.5} />
                <span className="text-sm">{link.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-muted py-16">
        <div className="mx-auto w-full max-w-6xl px-6">
          <h2 className="text-balance text-3xl tracking-[-0.03em] text-foreground md:text-4xl">
            What matters to you, matters to us
          </h2>
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
            {highlights.map((highlight) => (
              <article
                key={highlight.title}
                className="card-hover flex flex-col rounded-2xl border border-border bg-card"
              >
                <div className="overflow-hidden rounded-t-2xl">
                  <Image
                    src={highlight.img}
                    alt={highlight.title}
                    width={600}
                    height={400}
                    className="h-40 w-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-heading text-lg font-medium text-foreground">
                    {highlight.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {highlight.desc}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-primary py-14">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-6 px-6 md:flex-row md:items-center">
          <div>
            <h2 className="text-2xl tracking-tight text-white md:text-3xl">
              Not sure which solution is right for you?
            </h2>
            <p className="mt-2 text-white/80">
              We have a range of specialists who can work with you to tailor the
              right solution.
            </p>
          </div>
          <Link
            href="/personal/enquiry"
            className={buttonVariants({
              className:
                "h-12 shrink-0 rounded-full px-8 text-base bg-[var(--accent)] text-[var(--accent-foreground)] hover:bg-[var(--accent)] hover:opacity-90 font-semibold",
            })}
          >
            Make an enquiry
          </Link>
        </div>
      </section>

      <section className="bg-muted py-16">
        <div className="mx-auto w-full max-w-6xl px-6">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {profiles.map((profile) => (
              <article
                key={profile.title}
                className="card-hover flex flex-col rounded-2xl border border-border bg-card"
              >
                <div className="overflow-hidden rounded-t-2xl">
                  <Image
                    src={profile.img}
                    alt={profile.title}
                    width={600}
                    height={400}
                    className="h-40 w-full object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-heading text-lg font-medium text-foreground">
                    {profile.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm text-muted-foreground">
                    {profile.desc}
                  </p>
                  <span className="mt-4 border-t border-border pt-3 text-sm font-semibold text-primary">
                    Read more
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-muted py-16">
        <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-10 px-6 md:grid-cols-2">
          <h2 className="text-xl tracking-tight text-foreground">
            Things you should know
          </h2>
          <div className="space-y-4 text-sm text-muted-foreground">
            <p>
              Terms, conditions, fees, charges and lending criteria apply.
              Individual circumstances may vary. You should consult your
              taxation advisor and read the relevant Terms and Conditions
              available at Ally before making a decision. Rates are
              subject to change.
            </p>
            <p>
              ^ Awards are based on information collected from the DBM Atlas
              research program — feedback from over 80,000 businesses and/or
              retail customers January 2021 through December 2021.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
