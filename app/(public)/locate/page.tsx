import type { Metadata } from "next";
import { MapPin } from "lucide-react";

import { PageHero } from "@/components/site/page-hero";
import { buildMetadata } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Locate a Branch, ATM or Agency",
  description:
    "Find your nearest Ally branch, ATM or agency. View branch addresses, contact details, and an interactive map.",
  path: "/locate",
});

const branches = [
  {
    name: "Ally",
    address: "36 Main Street, Box Hill VIC 3128",
    email: "support@allybanks.cc",
  },
  {
    name: "ATM iStandard GroupMarketplace",
    address: "116 - 120 Mitchell Street, Ally 3550",
  },
];

export default function LocatePage() {
  return (
    <>
      <PageHero title="Locate a branch, agency or ATM" />

      <section className="py-16">
        <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-8 px-6 lg:grid-cols-2">
          <ul className="space-y-6">
            {branches.map((branch) => (
              <li
                key={branch.name}
                className="rounded-2xl border border-border bg-card p-6"
              >
                <h2 className="flex items-center gap-2 font-heading text-lg font-medium text-foreground">
                  <MapPin className="size-5 text-primary" strokeWidth={1.5} />
                  {branch.name}
                </h2>
                <p className="mt-2 text-muted-foreground">{branch.address}</p>
                {branch.email && (
                  <p className="mt-2 text-sm">
                    <span className="font-semibold text-foreground">
                      Email:{" "}
                    </span>
                    <a
                      href={`mailto:${branch.email}`}
                      className="text-primary underline"
                    >
                      {branch.email}
                    </a>
                  </p>
                )}
              </li>
            ))}
          </ul>

          <div className="h-96 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <iframe
              title="Ally branch map"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3021.870759647729!2d-74.0060156845936!3d40.71277597933009!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25a316c6b7b2d%3A0x7b8b1b1b1b1b1b1b!2sNew%20York%20St%2C%20New%20York%2C%20NY%2010007%2C%20USA!5e0!3m2!1sen!2sus!4v1688570000000!5m2!1sen!2sus"
            />
          </div>
        </div>
      </section>
    </>
  );
}
