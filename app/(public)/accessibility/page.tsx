import type { Metadata } from "next";
import Link from "next/link";

import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { PageHero } from "@/components/site/page-hero";
import { buttonVariants } from "@/components/ui/button";
import { buildMetadata } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Accessibility & Inclusion",
  description:
    "We're committed to creating a safe, inclusive and empowering banking environment where everyone can thrive. Learn about our accessibility commitments and partnerships.",
  path: "/accessibility",
});

const partnerships = [
  {
    title: "Vision",
    text: "We work with Vision on design and testing of our key banking services for the visually impaired. A first of its kind, online learning for Better Banking for People.",
  },
  {
    title: "Network on Disability",
    text: "Network on Disability (AND) is a national not-for-profit membership-based organisation. AND specialises in supporting businesses in building disability confidence, engagement and action.",
  },
  {
    title: "PACE Mentoring",
    text: "PACE Mentoring is a dynamic mentoring program. They connect job seekers with disability to volunteer mentors from our staff.",
  },
];

const websiteAccessibility = [
  "Our website designs are responsive and adjust to fit the most popular devices' screen display sizes.",
  "We use icons to help explain information and our online forms also feature descriptive error messages to help users complete.",
  "The text size on each website page is adjustable and within our content we also use simple paragraphs and lists for enhanced readability.",
  "We make sure foreground and background colors meet colour contrast requirements.",
  "Our buttons are clearly labelled and we make sure that links make sense out of context.",
  "We use correctly structured semantic HTML to aid users who tab through content and use screen readers.",
  "Our search and navigation options are keyboard accessible and available across the website.",
  "We avoid using complex language within our web content.",
  "We avoid the over-use of abbreviations or industry jargon.",
  "We avoid using colour alone to convey meaning.",
];

export default function AccessibilityPage() {
  return (
    <>
      <PageHero
        title="Accessibility and inclusion"
        subtitle="We're committed to creating a safe, inclusive and empowering environment where everyone can thrive."
      />

      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "About Us", href: "/about" },
          { label: "Accessibility and inclusion" },
        ]}
      />

      <section className="py-16">
        <div className="mx-auto w-full max-w-6xl px-6">
          <h2 className="max-w-3xl text-balance text-3xl tracking-[-0.03em] text-foreground md:text-4xl">
            Inclusive and accessible design is good for everyone
          </h2>
          <p className="mt-4 max-w-3xl text-muted-foreground">
            At Ally, we value all abilities and capabilities. We want our
            products, services and workplace to be accessible to all people.
            Using industry expertise and advances ensures banking with us is
            positive and seamless.
          </p>
        </div>
      </section>

      <section className="border-y border-border bg-muted py-16">
        <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-8 px-6 md:grid-cols-3">
          {partnerships.map((partnership) => (
            <div
              key={partnership.title}
              className="rounded-2xl border border-border bg-card p-6"
            >
              <h3 className="font-heading text-xl font-medium text-foreground">
                {partnership.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {partnership.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto w-full max-w-6xl px-6">
          <h2 className="text-2xl tracking-tight text-foreground md:text-3xl">
            Website accessibility
          </h2>
          <p className="mt-3 max-w-3xl text-muted-foreground">
            We aim to meet WCAG (Web Content Accessibility Guidelines) 2.1 AA on
            our websites by:
          </p>
          <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
            <ul className="list-disc space-y-2 pl-6 text-foreground">
              {websiteAccessibility.slice(0, 7).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
              {websiteAccessibility.slice(7).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-muted py-14">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-6 px-6 md:flex-row md:items-center">
          <div>
            <h2 className="text-2xl tracking-tight text-foreground md:text-3xl">
              Ways to bank
            </h2>
            <p className="mt-2 text-muted-foreground">
              There are many different ways to bank with us. Find out more about
              our in-person, phone, online or on-the-go services.
            </p>
          </div>
          <Link
            href="/login"
            className={buttonVariants({
              className:
                "h-12 shrink-0 rounded-full px-8 text-base bg-[var(--accent)] text-[var(--accent-foreground)] hover:bg-[var(--accent)] hover:opacity-90 font-semibold",
            })}
          >
            Start banking with us
          </Link>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto w-full max-w-6xl px-6">
          <h2 className="text-2xl tracking-tight text-foreground md:text-3xl">
            Our Access and Inclusion Plan
          </h2>
          <div className="mt-4 max-w-3xl space-y-4 text-muted-foreground">
            <p>
              We&apos;re committed to creating an inclusive and supportive bank
              for our customers, staff and community. The Ally Access and
              Inclusion Plan aims to do this.
            </p>
            <p>
              Our focus is on three groups: our customers, our people, and our
              workplace. We aim to raise awareness, influence strategy, and
              drive initiatives to deliver change.
            </p>
            <p>
              The plan was a collaborative effort. We worked with the Australian
              Network on Disability and input from senior leaders. The
              Bank&apos;s employee and inclusion network was also involved. This
              network comprises members from across the organisation who have
              experience with disability. They share a passion for accessibility
              issues and building an inclusive workplace.
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-muted py-14">
        <div className="mx-auto w-full max-w-6xl px-6">
          <h3 className="max-w-3xl text-balance font-heading text-xl font-medium text-foreground md:text-2xl">
            We believe a diverse workforce supported by an inclusive culture is
            central to our success.
          </h3>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto w-full max-w-6xl px-6">
          <h2 className="text-2xl tracking-tight text-foreground md:text-3xl">
            We value your feedback
          </h2>
          <p className="mt-3 max-w-3xl text-muted-foreground">
            We continually strive to improve our accessibility and we value
            feedback from you on ways we can improve our access or fix any
            problems. Please contact us if there is information on this website,
            or in any of our digital channels, which you cannot access.
          </p>
          <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="font-heading text-lg font-medium text-foreground">
                Online
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Use our online{" "}
                <Link
                  href="/contact-us"
                  className="text-primary underline"
                  rel="noopener"
                >
                  customer feedback form
                </Link>
                .
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="font-heading text-lg font-medium text-foreground">
                Visit a branch
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Speak to a staff member at one of{" "}
                <Link href="/locate" className="text-primary underline">
                  our branches
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
