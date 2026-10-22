import type { Metadata } from "next";
import Link from "next/link";

import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { PageHero } from "@/components/site/page-hero";
import { buildMetadata, siteConfig } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy",
  description:
    "Learn how Ally collects, uses, discloses and protects your personal information. Read our full privacy policy.",
  path: "/privacy",
});

const toc = [
  { label: "About this policy", id: "about-this-policy" },
  { label: "Collection", id: "collection" },
  { label: "Use and disclosure", id: "use-and-disclosure" },
  { label: "Disclosure to overseas recipients", id: "disclosure-to-overseas-recipients" },
  { label: "Access and correction", id: "access-and-correction" },
  { label: "Opting out of product promotions", id: "opting-out-of-product-promotions" },
  {
    label: "Storage and security of your personal information",
    id: "storage-and-security-of-your-personal-information",
  },
  { label: "Our websites and the use of cookies", id: "our-website-and-the-use-of-cookies" },
  { label: "Changes to this policy", id: "changes-to-this-policy" },
  { label: "Contacting us", id: "contacting-us" },
];

export default function PrivacyPage() {
  return (
    <>
      <PageHero title="Privacy Policy" showLogo />

      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "Privacy policy" }]}
      />

      <section className="py-16">
        <div className="mx-auto w-full max-w-4xl px-6">
          <h2 className="text-2xl tracking-tight text-foreground md:text-3xl">
            Privacy Policy
          </h2>
          <ul className="mt-6 list-disc space-y-1 pl-6 text-sm text-muted-foreground">
            {toc.map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`} className="text-primary hover:underline">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="mt-12 space-y-12">
            <Section id="about-this-policy" title="About this policy">
              <p>
                This document sets out how Ally safeguards your privacy.
              </p>
              <p>
                We recognise the importance of protecting your privacy and are
                committed to ensuring the continued integrity and security of
                the personal information you entrust to us.
              </p>
              <p>
                Our aim is to comply at all times with the privacy laws that
                apply to us. If you have a comment, query or complaint regarding
                a privacy matter, we encourage you to discuss it with us.
              </p>
            </Section>

            <Section id="collection" title="Collection">
              <p>
                We usually collect personal information directly from you.
                Sometimes we collect or confirm this information from a third
                party. We will use reasonable efforts to obtain your consent
                prior to contacting a third party for this purpose.
              </p>
              <p>We collect personal information that includes details such as your:</p>
              <ul className="list-disc space-y-1 pl-6">
                <li>Identity information (Name, Date of Birth)</li>
                <li>
                  Contact information (such as phone numbers, address, and
                  e-mail addresses)
                </li>
                <li>
                  Financial information such as information about your use of
                  financial products and services which you acquire from or
                  through us
                </li>
              </ul>
              <p>
                In some cases, we may need to collect sensitive information
                about you (such as health related information). We will first
                seek your consent to collect such information where we are
                required to do so.
              </p>
            </Section>

            <Section id="use-and-disclosure" title="Use and disclosure">
              <p>We use your personal information in order to:</p>
              <ul className="list-disc space-y-1 pl-6">
                <li>Provide you with financial products and services</li>
                <li>Assist you with your queries or concerns</li>
                <li>Comply with any legal or regulatory obligations imposed on us</li>
                <li>Perform our necessary business functions</li>
                <li>
                  Identify and prevent fraud, scams and other unauthorised
                  activity
                </li>
              </ul>
              <p>
                To do this, we may disclose your personal information to
                organisations that carry out functions on our behalf. This may
                include mailing and printing houses, cheque and electronic
                transaction processors, information technology service
                providers, fraud detection and prevention providers,
                professional advisers, valuers, introducers and debt collection
                agencies.
              </p>
              <p>
                We may also disclose your personal information to regulators and
                government authorities as required by law.
              </p>
            </Section>

            <Section
              id="disclosure-to-overseas-recipients"
              title="Disclosure to overseas recipients"
            >
              <p>
                In some cases we may need to share some of your information with
                organisations outside your country. For example, when we use
                service providers located overseas to perform a function on our
                behalf.
              </p>
              <p>
                We may share your information with overseas organisations that
                are located in the following countries: Belgium, Bulgaria,
                Canada, Fiji, France, Germany, India, Indonesia, Ireland,
                Israel, Nauru, The Netherlands, New Zealand, Philippines,
                Singapore, Spain.
              </p>
              <p>
                When we share your information with organisations overseas we
                ensure appropriate data handling and security measures are in
                place.
              </p>
            </Section>

            <Section id="access-and-correction" title="Access and correction">
              <p>
                In most cases you can access your personal information held by
                us. If you believe that personal information we hold about you
                is inaccurate, out of date or incomplete, you should contact us.
              </p>
              <p>
                We will promptly update your personal information that is
                inaccurate, out of date or incomplete. In some cases we may
                request you provide us with supporting documentation to amend
                the personal information we hold about you.
              </p>
            </Section>

            <Section
              id="opting-out-of-product-promotions"
              title="Opting out of product promotions"
            >
              <p>
                You can opt out of receiving direct marketing material at any
                time by contacting us. If you do opt out, we will continue to
                provide information in relation to your existing accounts or
                facilities only (including new features or products related to
                these accounts/facilities).
              </p>
            </Section>

            <Section
              id="storage-and-security-of-your-personal-information"
              title="Storage and security of your personal information"
            >
              <p>
                We will take reasonable steps to keep the personal information
                we hold about you secure to ensure that it is protected from
                misuse, interference, loss, unauthorised access, modification or
                disclosure.
              </p>
              <p>
                Your personal information is stored within secure systems that
                are protected in controlled facilities. Our employees and
                authorised agents are obliged to respect the confidentiality of
                any personal information held by us.
              </p>
            </Section>

            <Section
              id="our-website-and-the-use-of-cookies"
              title="Our websites and the use of cookies"
            >
              <p>
                We use our best efforts to ensure that information received via
                our Websites remains secured within our systems. We are
                regularly reviewing developments in online security; however,
                you should be aware that there are inherent risks in
                transmitting information across the internet.
              </p>
              <p>
                We use cookies on our Websites. Cookies can make using our
                Websites easier by storing information about your preferences
                and enabling you to take full advantage of our services. Cookies
                are very small text files that a Website can transfer to your
                computer&apos;s hard drive or portable electronic device&apos;s
                memory for record keeping.
              </p>
              <p>
                Most internet web browsers are pre-set to accept cookies to
                enable full use of websites that employ them. However, if you do
                not wish to receive any cookies you may configure your browser
                to reject them or receive a warning when cookies are being used.
              </p>
            </Section>

            <Section id="changes-to-this-policy" title="Changes to this policy">
              <p>
                From time to time, it may be necessary for us to review this
                policy and the information contained in this document. We will
                notify you of any changes by posting an updated version on our
                website(s).
              </p>
            </Section>

            <Section id="contacting-us" title="Contacting us">
              <p>
                If you have any questions about this policy, what personal
                information or credit related information we may hold in
                relation to you, or about the way we manage your personal
                information you can contact us.
              </p>
              <p>
                Email:{" "}
                <a
                  href={`mailto:${siteConfig.contactEmail}`}
                  className="text-primary underline"
                >
                  {siteConfig.contactEmail}
                </a>
                <br />
                Phone:{" "}
                <a
                  href={`tel:${siteConfig.phoneHref}`}
                  className="text-primary underline"
                >
                  {siteConfig.phone}
                </a>
              </p>
            </Section>

            <Section
              id="privacy-queries-or-complaints"
              title="Privacy queries or complaints"
            >
              <p>
                If you have a query or wish to make a complaint regarding the
                handling of your personal information, including your credit
                related information, by us, please contact our Customer Feedback
                Team. We will promptly investigate your complaint and notify you
                of the outcome.
              </p>
              <Link
                href="/contact-us"
                className="inline-flex items-center justify-center rounded-full bg-[var(--primary)] px-6 py-3 font-semibold text-white transition-colors hover:bg-[var(--primary-deep)]"
              >
                Resolve a complaint
              </Link>
            </Section>
          </div>
        </div>
      </section>
    </>
  );
}

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div id={id} className="scroll-mt-24">
      <h3 className="font-heading text-xl font-medium text-foreground">
        {title}
      </h3>
      <div className="mt-3 space-y-3 text-muted-foreground">{children}</div>
    </div>
  );
}
