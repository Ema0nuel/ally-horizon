import type { Metadata } from "next";

import { ContactForm } from "@/components/site/contact-form";
import { PageHero } from "@/components/site/page-hero";
import { buildMetadata, siteConfig } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Contact Us",
  description:
    "Get in touch with Ally. Choose the method that is most convenient for you — online form, email, or phone. Our team is here to help.",
  path: "/contact-us",
});

export default function ContactUsPage() {
  return (
    <>
      <PageHero
        title="Contact Ally"
        subtitle="Choose the method that is most convenient for you."
      />

      <section className="py-16">
        <div className="mx-auto w-full max-w-3xl px-6">
          <h2 className="text-2xl tracking-tight text-foreground md:text-3xl">
            Contact form
          </h2>
          <div className="mt-8">
            <ContactForm />
          </div>

          <div className="mt-12">
            <h3 className="font-heading text-xl font-medium text-foreground">
              Other ways to contact us
            </h3>
            <div className="mt-4 space-y-2 text-base">
              <p>
                Email:{" "}
                <a
                  href={`mailto:${siteConfig.contactEmail}`}
                  className="text-primary hover:underline"
                >
                  {siteConfig.contactEmail}
                </a>
              </p>
              <p>
                Phone:{" "}
                <a
                  href={`tel:${siteConfig.phoneHref}`}
                  className="text-primary hover:underline"
                >
                  {siteConfig.phone}
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
