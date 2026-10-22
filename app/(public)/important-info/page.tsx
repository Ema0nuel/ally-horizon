import type { Metadata } from "next";
import Link from "next/link";
import {
  FileText,
  Globe,
  Scale,
  ShieldCheck,
  Target,
} from "lucide-react";

import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { PageHero } from "@/components/site/page-hero";
import { buildMetadata } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Important Information",
  description:
    "Find important information about Ally including our codes of practice, disclosure documents, the Financial Claims Scheme, privacy, and more.",
  path: "/important-info",
});

const infoTiles = [
  {
    icon: Scale,
    title: "Codes of practice",
    href: "/about",
    linkText: "Learn more about our codes of practice",
    details: [
      "We comply with a range of codes of practices including:",
      "Banking Code of Practice",
      "Code of Operation for the Department of Human Services and the Department of Veterans' Affairs",
      "Family Law Guidelines",
      "ePayments Code",
    ],
  },
  {
    icon: FileText,
    title: "Disclosure documents",
    href: "/important-info",
    linkText: "View our disclosure documents",
    details: [
      "Access all Ally disclosure documents, including:",
      "Terms and conditions for products and services",
      "Product disclosure statements",
      "Privacy disclosure statement",
      "Electronic communication consent",
      "Financial services guide, and more.",
    ],
  },
  {
    icon: ShieldCheck,
    title: "Financial Claims Scheme (FCS)",
    href: "/about",
    linkText: "Learn more about FCS",
    details: [
      "A government scheme that provides protection and quick access to deposits in financial institutions in the unlikely event that one of these financial institutions fails.",
    ],
  },
  {
    icon: ShieldCheck,
    title: "Privacy",
    href: "/privacy",
    linkText: "View our policies",
    details: [
      "Learn how we manage personal and credit related information through our:",
      "Ally Privacy Policy",
      "Credit Reporting Policy",
      "Credit Reporting Statement of Notifiable Matters",
      "Consumer Data Right",
    ],
  },
  {
    icon: Target,
    title: "Target Market Determinations (TMD)",
    href: "/target-market",
    linkText: "Learn more about TMDs",
    details: [
      "Target Market Determinations for financial products distributed by Ally are to ensure that the right products end up in the hands of the right customer. We do this by focusing on our customers in the design and distribution of our financial products.",
    ],
  },
  {
    icon: Globe,
    title: "Website terms of use",
    href: "/terms",
    linkText: "Read our terms of use",
    details: [
      "The terms of use for the Ally website sets the rules for using our website with our rights in, and restrictions on your use of, the site, product and services information, third party content and jurisdiction.",
    ],
  },
];

export default function ImportantInfoPage() {
  return (
    <>
      <PageHero title="Important information" showLogo />

      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Important information" },
        ]}
      />

      <section className="py-16">
        <div className="mx-auto w-full max-w-6xl px-6">
          <h2 className="text-balance text-center text-3xl tracking-[-0.03em] text-foreground md:text-4xl">
            Find information that may be important to you
          </h2>
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {infoTiles.map((tile) => (
              <div
                key={tile.title}
                className="card-hover flex flex-col rounded-2xl border border-border bg-card p-6"
              >
                <span className="grid size-12 place-items-center rounded-xl bg-[var(--lilac)] text-[var(--primary-deep)]">
                  <tile.icon className="size-6" strokeWidth={1.5} />
                </span>
                <h3 className="font-heading mt-4 text-lg font-medium text-foreground">
                  {tile.title}
                </h3>
                <ul className="mt-3 flex-1 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                  {tile.details.map((detail) => (
                    <li key={detail}>{detail}</li>
                  ))}
                </ul>
                <Link
                  href={tile.href}
                  className="mt-5 inline-flex items-center justify-center rounded-full bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[var(--primary-deep)]"
                >
                  {tile.linkText}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
