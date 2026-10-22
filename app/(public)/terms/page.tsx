import type { Metadata } from "next";

import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { PageHero } from "@/components/site/page-hero";
import { buildMetadata, siteConfig } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Terms of Use",
  description:
    "The terms of use governing the Ally website, including our rights in the website, product and services information, and third party content.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <>
      <PageHero title="Terms of use" showLogo />

      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "Terms of use" }]}
      />

      <section className="py-16">
        <div className="mx-auto w-full max-w-4xl px-6">
          <div className="space-y-6 text-muted-foreground">
            <div>
              <h2 className="font-heading text-2xl font-medium text-foreground">
                1. This website
              </h2>
              <p className="mt-3">
                This website (&quot;Website&quot;) is owned and operated by
                Ally (&quot;we&quot; / &quot;us&quot; / &quot;our&quot;),
                on our behalf and that of our related bodies corporate. Contact:{" "}
                <a
                  href={`mailto:${siteConfig.contactEmail}`}
                  className="text-primary underline"
                >
                  {siteConfig.contactEmail}
                </a>{" "}
                |{" "}
                <a
                  href={`tel:${siteConfig.phoneHref}`}
                  className="text-primary underline"
                >
                  {siteConfig.phone}
                </a>
                .
              </p>
              <p className="mt-3">
                These terms of use (the &quot;Terms&quot;) govern your use of
                this Website (the &quot;Website Content&quot;). Each time you
                use this Website, your use indicates your acknowledgment and
                acceptance of the Terms, which we may revise periodically
                without notice. If you do not accept these terms and conditions,
                do not use the Website.
              </p>
            </div>

            <div>
              <h2 className="font-heading text-2xl font-medium text-foreground">
                2. Our rights in, and restrictions on your use of, this Website
              </h2>
              <p className="mt-3">
                The Website Content (including trade marks and logos) is our
                intellectual property or that of our suppliers. We grant you a
                non-exclusive, non-transferable and limited right to access and
                use this Website, view the Website Content on your screen and
                print copies of such Website Content, solely for your personal,
                non-commercial use, and provided that you comply fully with
                these Terms.
              </p>
              <p className="mt-3">
                While we take reasonable steps to ensure that the Website
                Content is free from errors or omissions or is suitable for your
                intended use, we do not represent or warrant the availability,
                accuracy, adequacy or completeness of the Website Content or
                that the Website and Website Content is virus-free. You further
                acknowledge and agree that to the maximum extent permitted by
                law: (a) this Website and the Website Content are provided on an
                &quot;as is&quot; and &quot;as available&quot; basis; and (b) we
                cannot guarantee and do not promise any specific results from
                use of this Website and the Website Content.
              </p>
              <p className="mt-3">You acknowledge that:</p>
              <ol className="mt-2 list-decimal space-y-1 pl-6">
                <li>
                  we may at any time modify, discontinue, temporarily suspend or
                  permanently remove the Website or the Website Content (or any
                  part thereof); and
                </li>
                <li>
                  we will not be liable to you or any third party for doing so.
                </li>
              </ol>
              <p className="mt-3">
                If this Website enables you to create and use an online account,
                you agree that such online account is subject to the terms and
                conditions that you agreed to in creating that account,
                including the applicable Disclosure Document.
              </p>
            </div>

            <div>
              <h2 className="font-heading text-2xl font-medium text-foreground">
                3. Product and Services Information
              </h2>
              <p className="mt-3">
                Products and services displayed or offered on this Website
                contain general information about Ally products and
                services and can be changed by us at any time at our discretion.
                In the event of any conflict or inconsistency between this
                Website and the applicable disclosure document (such as a
                Product Disclosure Statement), the applicable disclosure
                document will take precedence. The information on this Website:
              </p>
              <ol className="mt-2 list-decimal space-y-1 pl-6">
                <li>
                  is not an offer or solicitation by anyone in any jurisdiction
                  in which an offer or solicitation cannot legally be made, or
                  to any person to whom it is unlawful to make a solicitation;
                </li>
                <li>
                  does not form part of the terms and conditions for Ally
                  products and services; and
                </li>
                <li>
                  has been prepared without taking into account your objectives,
                  financial situation or needs. Before acting on the basis of
                  this information, you should consider (with or without the
                  assistance of an adviser) how appropriate the information is
                  having regard to your objectives, financial situations and
                  needs. You must read the applicable Financial Services Guides
                  (FSG) and our Credit Guide.
                </li>
              </ol>
            </div>

            <div>
              <h2 className="font-heading text-2xl font-medium text-foreground">
                4. Third Party Content
              </h2>
              <p className="mt-3">
                Links from this Website to third party websites, or references
                to products, services or publications other than those of Ally, do not imply the endorsement or approval of such third
                party websites, products, services or publications by Ally. Any access and use you make of such third party material
                is entirely at your own risk.
              </p>
              <p className="mt-3">
                The opinions or views that Ally makes available via third
                party websites or social media providers (such as videos or
                tweets) (each, a &quot;Publication&quot;) are not necessarily
                the opinions or views of Ally, and Ally makes no
                representation and gives no warranty as to the accuracy,
                currency or completeness of material contained in any
                Publication.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
