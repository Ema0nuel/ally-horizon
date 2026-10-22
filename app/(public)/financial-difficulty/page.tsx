import type { Metadata } from "next";
import Link from "next/link";

import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { buildMetadata, siteConfig } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Financial Difficulty Assistance",
  description:
    "Experiencing financial difficulty? We're here to help. Learn how to apply for assistance, the options available, and the application process at Ally.",
  path: "/financial-difficulty",
});

export default function FinancialDifficultyPage() {
  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Support", href: "/support" },
          { label: "Financial difficulty assistance" },
        ]}
      />

      <section className="py-14">
        <div className="mx-auto w-full max-w-6xl px-6">
          <h1 className="max-w-2xl text-balance text-3xl tracking-[-0.03em] text-foreground md:text-4xl">
            Financial difficulty assistance
          </h1>
          <div className="mt-6 max-w-3xl space-y-4 text-muted-foreground">
            <p>
              We understand there may be times when your personal circumstances
              change. You may experience an unexpected event or changes outside
              of your control like losing your job, suffering an illness or
              injury, being affected by a natural disaster, or a downturn in
              your business.
            </p>
            <p>
              As a result, if you can&apos;t afford the minimum repayment on
              your loan or credit card, and would like us to consider if we can
              provide financial difficulty assistance, please contact us
              immediately. The sooner you contact us the sooner we can try to
              help you.
            </p>
            <p>
              In many instances help can be provided quickly and efficiently
              over the phone. Otherwise we may need to do a more detailed
              assessment of your personal and financial circumstances to
              identify how we might be able to help.
            </p>
            <p>
              Financial difficulty assistance is available to you, whether you
              are an individual, joint account holder, guarantor or small
              business customer.
            </p>
          </div>
        </div>
      </section>

      <Section title="Apply for assistance">
        <p>
          If you would like to apply for assistance, please contact:
        </p>
        <p>
          <strong>Mortgage Help Centre</strong>
          <br />
          Email:{" "}
          <a
            href={`mailto:${siteConfig.contactEmail}`}
            className="text-primary underline"
          >
            {siteConfig.contactEmail}
          </a>
        </p>
      </Section>

      <Section title="Assistance options">
        <p>
          This will depend on your personal circumstances and financial
          situation, and may include:
        </p>
        <ul className="list-disc space-y-1 pl-6">
          <li>Tailoring a payment arrangement</li>
          <li>Deferring or reducing loan payments for a defined period of time</li>
          <li>Extending the loan term</li>
          <li>Capitalising loan arrears</li>
          <li>Product conversion</li>
          <li>Debt consolidation</li>
          <li>Interest only period</li>
        </ul>
        <p>
          It is important to contact us early so that we can discuss your
          situation and provide the best options available to you.
        </p>
      </Section>

      <Section title="Application process">
        <p>
          If you think you are, or will be, unable to meet your debt obligations
          please contact us as soon as possible.
        </p>
        <p>
          Depending on your situation we may be able to provide assistance
          quickly and efficiently over the phone. Alternatively we may require
          further information and documentation to help us understand your
          financial position and determine whether assistance is appropriate,
          such as:
        </p>
        <ul className="list-disc space-y-1 pl-6">
          <li>
            A statement of financial position summarising your current income,
            expenditure, assets and liabilities
          </li>
          <li>An employment contract and/or payslips</li>
          <li>Your account statements</li>
          <li>Centrelink statement and/or social security payment details</li>
          <li>A medical certificate from a qualified medical practitioner</li>
          <li>An employment separation statement</li>
          <li>A contract of sale/ sales agency agreement</li>
          <li>Other documents which support your request</li>
        </ul>
        <p>
          Once you have provided us with all the requested information necessary
          to review your financial situation, we will provide you with a
          decision within 21 days.
        </p>
      </Section>

      <Section title="Assessing your application">
        <p>
          Our dedicated team will contact you. When assessing your request they
          will take into account factors including:
        </p>
        <ul className="list-disc space-y-1 pl-6">
          <li>The reason for financial difficulty</li>
          <li>Your current financial position</li>
          <li>
            Your ability to meet the commitments under the proposed arrangement
            and future repayments under the contract
          </li>
          <li>
            The ability to rehabilitate your circumstances (based on whether the
            financial difficulty assistance will offer genuine relief to restore
            your financial situation)
          </li>
        </ul>
      </Section>

      <Section title="Letting you know">
        <p>
          We will tell you in writing if we can assist you, the reason for our
          decision to provide assistance and the main details of the proposed
          new arrangements.
        </p>
        <p>
          You&apos;ll need to ensure that you meet the terms of the new
          arrangement. If you are subsequently unable to meet these terms, you
          should contact us as soon as possible to discuss your situation.
        </p>
      </Section>

      <Section title="Will my credit report be impacted?">
        <p>
          If your hardship assistance application is approved, a record that
          your payment obligations under your loans have been affected by an
          agreed financial hardship arrangement, will be recorded with the
          repayment history information on your credit report. If you follow all
          the terms of the arrangement, we will report your repayment history
          information as up to date.
        </p>
      </Section>

      <Section title="If your application is declined">
        <p>
          There may be a number of reasons why we decide not to provide
          financial difficulty assistance. If this is the case the reason for
          the decision will be explained to you in writing. We&apos;ll also seek
          to discuss the next steps we will take and other available options
          with you.
        </p>
      </Section>

      <section className="border-t border-border py-14">
        <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-10 px-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <h2 className="text-2xl tracking-tight text-foreground md:text-3xl">
              Not satisfied with the outcome?
            </h2>
            <p className="mt-4 text-muted-foreground">
              Please contact our team who will promptly investigate your
              complaint and notify you the outcome.
            </p>
          </div>
          <div>
            <Link
              href="/contact-us"
              className="inline-flex w-full items-center justify-center rounded-full bg-[var(--primary)] px-6 py-3 font-semibold text-white transition-colors hover:bg-[var(--primary-deep)]"
            >
              Resolve a complaint
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-border py-14">
      <div className="mx-auto w-full max-w-6xl px-6">
        <h2 className="text-2xl tracking-tight text-foreground md:text-3xl">
          {title}
        </h2>
        <div className="mt-4 max-w-3xl space-y-4 text-muted-foreground">
          {children}
        </div>
      </div>
    </section>
  );
}
