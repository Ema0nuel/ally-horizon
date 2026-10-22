import type { Metadata } from "next";
import Image from "next/image";

import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { PageHero } from "@/components/site/page-hero";
import { buildMetadata, siteConfig } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Target Market Determinations",
  description:
    "Target Market Determinations for financial products issued and/or distributed by Ally, designed to deliver better customer outcomes.",
  path: "/target-market",
});

export default function TargetMarketPage() {
  return (
    <>
      <PageHero title="Target Market Determinations" showLogo>
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
      </PageHero>

      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Important information", href: "/important-info" },
          { label: "Target Market Determinations" },
        ]}
      />

      <section className="py-16">
        <div className="mx-auto w-full max-w-5xl px-6">
          <h2 className="text-2xl tracking-tight text-foreground md:text-3xl">
            Delivering better customer outcomes
          </h2>
        </div>
      </section>

      <section className="pb-16">
        <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-10 px-6 md:grid-cols-2">
          <div className="space-y-4 text-muted-foreground">
            <p>
              We are required to make Target Market Determinations available
              under the{" "}
              <em>
                Treasury Laws Amendment (Design and Distribution Obligations and
                Product Intervention Powers) Act (Cth) 2019
              </em>
              .
            </p>
            <p>
              This is to ensure that the right products end up in the hands of
              the right customer by focusing on our customers in the design and
              distribution of our financial products.
            </p>
            <h3 className="font-heading text-lg font-medium text-foreground">
              What is a Target Market Determination (TMD)?
            </h3>
            <p>A TMD is a document which describes:</p>
            <ul className="list-disc space-y-1 pl-6">
              <li>the persons for which the product has been designed,</li>
              <li>the conditions around the product&apos;s distribution,</li>
              <li>when this TMD will be reviewed, and</li>
              <li>record keeping and reporting obligations of distributors.</li>
            </ul>
            <p>
              Please note a TMD is not intended to provide financial advice.
              When making a decision about a product always make sure you refer
              to the Terms and Conditions and any supplementary document(s).
              These will outline the relevant terms and conditions being
              provided under that product.
            </p>
          </div>
          <div className="overflow-hidden rounded-2xl border border-border bg-card">
            <Image
              src="https://images.unsplash.com/photo-1554224154-26032ffc0d07?auto=format&fit=crop&w=1200&q=80"
              alt="Target Market Determinations documents"
              width={600}
              height={400}
              className="h-44 w-full object-cover"
            />
            <div className="p-6 text-sm text-muted-foreground">
              <p>
                This page includes the Target Market Determinations for
                financial products issued and/or distributed by Ally.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
