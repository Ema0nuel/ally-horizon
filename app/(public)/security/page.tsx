import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Building2,
  FileText,
  Globe,
  Phone,
  Search,
  ShieldCheck,
  Users,
} from "lucide-react";

import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { PageHero } from "@/components/site/page-hero";
import { buildMetadata, siteConfig } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Security",
  description:
    "Keep your identity, business and family safe. Learn how to spot a scam, protect yourself online and on the phone, and reduce cheque fraud with Ally.",
  path: "/security",
});

const featureTiles = [
  {
    icon: ShieldCheck,
    title: "Keeping your identity safe",
    details:
      "Identity theft is a type of fraud that involves stealing money or gaining other benefits by pretending to be someone else. Learn how you can protect yourself.",
    linkText: "Learn more about identity theft",
  },
  {
    icon: Building2,
    title: "Protecting your business",
    details:
      "Businesses can also be targeted by criminals. It's important business owners implement appropriate risk management practices and systems to adequately protect themselves and their customers.",
    linkText: "Learn more about business security",
  },
  {
    icon: Search,
    title: "How to spot a scam",
    details:
      "Learn about the scams that could impact you, then understand how to protect yourself.",
    linkText: "Learn more about scams",
  },
];

const highlightTiles = [
  {
    icon: ShieldCheck,
    title: "General",
    items: [
      "Keep your computer up to date by installing the latest security software and patches for your operating system",
      "Ensure you have installed anti-virus/spyware software along with a firewall — and keep them up to date",
      "Make sure you have a current backup of your important personal information/files",
      "Delete spam emails and do not open email attachments or click on links in emails from strangers",
      "Do not respond to an unsolicited email asking you for personal information or financial details",
      "Be aware of email, internet and telephone hoaxes and scams — if something appears too good to be true, it almost certainly is",
      "If possible avoid using shared computers, such as those at internet cafes, hotels and airports",
    ],
  },
  {
    icon: Phone,
    title: "Phone",
    items: [
      "Criminals use phones as the number one delivery method for scams",
      "Never allow anyone to access your computer/device remotely",
      "Never provide your 6-digit code from a security token to anyone over the phone",
      "Do not respond to unsolicited calls, SMS or email asking you for personal information or financial details",
      "Delete spam emails and do not open SMS or email attachments or click on links in SMS or emails from strangers",
      "Be aware of email, internet and telephone hoaxes and scams — if something appears too good to be true, it almost certainly is",
    ],
  },
  {
    icon: Globe,
    title: "Online",
    items: [
      "Don't open suspicious texts, pop up windows or click on links or attachments in unsolicited emails — delete them",
      "Don't enter or provide your card number to unsolicited sites or callers",
      "Don't respond to phone calls about your computer asking for remote access — hang up",
      "Keep your personal details secure",
      "Choose your passwords carefully",
      "Review your privacy and security settings on social media",
      "Beware of any requests for your personal details or money",
      "If you think you have been a victim of a scam, you need to let us know as soon as possible by calling us or by attending your nearest branch",
    ],
  },
  {
    icon: Users,
    title: "Protecting your children",
    items: [
      "Increasingly, children are being targeted online and can be vulnerable to aggressive behaviour and criminal activity.",
      "Children are soft targets — they use the internet regularly and interact via social media, but they're often too inexperienced to recognise when they are being deceived.",
      "Education is the best way to help protect your children.",
    ],
  },
  {
    icon: FileText,
    title: "Cheque fraud",
    items: [
      "Not many people use cheques these days, but cheque fraud is still prevalent. Consider the following tips to help reduce cheque fraud:",
      "Keep your chequebook in a safe and secure place",
      "Never pre-sign cheques",
      "When mailing cheques, cross the cheque 'Not Negotiable' and send it in a plain envelope without a window",
      "Use a pen or felt tip pen to write on your cheques, never pencil",
      "Bank Cheques should not be considered as good as cash",
      "Don't accept cheques in excess of the agreed price where you are asked to transfer/deposit the balance to a specific account",
    ],
  },
];

export default function SecurityPage() {
  return (
    <>
      <PageHero title="Security" showLogo>
        <p className="text-lg text-white/90">
          {siteConfig.name}
          <br />
          <a
            href={`mailto:${siteConfig.contactEmail}`}
            className="underline"
          >
            {siteConfig.contactEmail}
          </a>{" "}
          |{" "}
          <a href={`tel:${siteConfig.phoneHref}`} className="underline">
            {siteConfig.phone}
          </a>
        </p>
        <Link
          href="/security"
          className="mt-2 inline-flex items-center justify-center rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-[var(--accent-foreground)] transition-colors hover:bg-[var(--accent)] hover:opacity-90"
        >
          View the latest scam alerts
        </Link>
      </PageHero>

      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "Security" }]}
      />

      <section className="py-16">
        <div className="mx-auto w-full max-w-6xl px-6">
          <h2 className="text-balance text-3xl tracking-[-0.03em] text-foreground md:text-4xl">
            Ways to stay safe
          </h2>
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {featureTiles.map((tile) => (
              <article
                key={tile.title}
                className="card-hover flex flex-col rounded-2xl border border-border bg-card"
              >
                <Image
                  src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1200&q=80"
                  alt={tile.title}
                  width={600}
                  height={400}
                  className="h-32 w-full rounded-t-2xl object-cover"
                />
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-heading text-lg font-medium text-foreground">
                    {tile.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm text-muted-foreground">
                    {tile.details}
                  </p>
                  <Link
                    href="/security"
                    className="mt-4 text-sm font-semibold text-primary hover:underline"
                  >
                    {tile.linkText}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border py-16">
        <div className="mx-auto w-full max-w-6xl px-6">
          <h2 className="max-w-3xl text-balance text-3xl tracking-[-0.03em] text-foreground md:text-4xl">
            Protecting yourself and your family
          </h2>
          <p className="mt-4 max-w-3xl text-muted-foreground">
            Protecting yourself and your family from scams and identity theft
            can save you a lot of inconvenience, disruption and money. We have
            compiled a list of tips to help you protect yourself.
          </p>
        </div>
      </section>

      <section className="border-t border-border bg-muted py-16">
        <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-8 px-6 md:grid-cols-2">
          {highlightTiles.map((tile) => (
            <div
              key={tile.title}
              className="card-hover flex flex-col rounded-2xl border border-border bg-card p-6"
            >
              <span className="mx-auto grid size-12 place-items-center rounded-xl bg-[var(--lilac)] text-[var(--primary-deep)]">
                <tile.icon className="size-6" strokeWidth={1.5} />
              </span>
              <h3 className="mt-4 text-center font-heading text-lg font-medium text-foreground">
                {tile.title}
              </h3>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                {tile.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-muted py-14">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-6 px-6 md:flex-row md:items-center">
          <h2 className="text-xl tracking-tight text-foreground md:text-2xl">
            Think you&apos;ve received a scam message?
          </h2>
          <Link
            href="/security"
            className="rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-[var(--accent-foreground)] transition-colors hover:bg-[var(--accent)] hover:opacity-90"
          >
            View the latest scam alerts
          </Link>
        </div>
      </section>
    </>
  );
}
