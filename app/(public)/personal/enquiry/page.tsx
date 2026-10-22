import type { Metadata } from "next";
import Link from "next/link";

import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { EnquiryForm } from "@/components/site/enquiry-form";
import { PageHero } from "@/components/site/page-hero";
import { buildMetadata, siteConfig } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Home Loan Enquiry",
  description:
    "Whether you're looking to buy or refinance, our lending specialists will assist you in your home buying journey. Make a home loan enquiry with Ally.",
  path: "/personal/enquiry",
});

export default function PersonalEnquiryPage() {
  return (
    <>
      <PageHero
        title="Home Loan Enquiry"
        subtitle="Whether you're looking to buy or refinance, we'll be able to assist you in your home buying journey."
      />

      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Personal banking", href: "/personal" },
          { label: "Home loan enquiry" },
        ]}
      />

      <section className="py-16">
        <div className="mx-auto w-full max-w-2xl px-6">
          <h2 className="text-2xl tracking-tight text-foreground md:text-3xl">
            Home loan enquiry
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            For your security, we do not provide information of a personal or
            account-specific nature by email.
          </p>

          <div className="mt-8">
            <EnquiryForm />
          </div>

          <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
            We collect your personal information in order to respond to your
            enquiry and contact you; your personal information may be shared
            within the Group. This includes subsidiaries, related companies,
            agencies and franchises. To request access to your personal
            information, please contact your{" "}
            <Link href="/locate" className="text-primary hover:underline">
              nearest branch
            </Link>{" "}
            or{" "}
            <a
              href={`mailto:${siteConfig.contactEmail}`}
              className="text-primary hover:underline"
            >
              {siteConfig.contactEmail}
            </a>
            . For more information, please read our{" "}
            <Link href="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  );
}
