import type { Metadata } from "next";
import Link from "next/link";
import {
  Calculator,
  GraduationCap,
  Leaf,
  Lock,
  Move,
  Percent,
  SlidersHorizontal,
  TrendingUp,
  Unlock,
  Zap,
} from "lucide-react";

import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { PageHero } from "@/components/site/page-hero";
import { buttonVariants } from "@/components/ui/button";
import { buildMetadata } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Personal Loans",
  description:
    "Bring your plans to life with a Ally personal loan. Compare secured and unsecured loan options, competitive rates, and flexible repayment terms.",
  path: "/personal",
});

const quickLinks = [
  { icon: Lock, label: "Secured personal loan" },
  { icon: Unlock, label: "Unsecured personal loan" },
  { icon: Leaf, label: "Secured green personal loan" },
  { icon: Leaf, label: "Unsecured green personal loan" },
  { icon: GraduationCap, label: "Secured student personal loan" },
  { icon: GraduationCap, label: "Unsecured student personal loan" },
];

const benefits = [
  {
    icon: SlidersHorizontal,
    title: "Flexible options",
    text: "Choose from weekly, fortnightly or monthly repayments, secured or unsecured loans with terms up to 7 years.",
  },
  {
    icon: Move,
    title: "Big or small",
    text: "Choose a loan size to suit your needs. Whether for a holiday, a car, a boat or something completely different, just ask us.",
  },
  {
    icon: Zap,
    title: "Quick response",
    text: "We know you want to hear about your application quickly. You will have a response from us within 48 hours.",
  },
];

const secured = [
  {
    name: "Personal Loan",
    text: "Whether it's for a car, a boat, a holiday or something completely different.",
    rate: "7.79% p.a.",
    comparison: "8.51% p.a.",
  },
  {
    name: "Green Personal Loan",
    text: "This loan rewards you for your environmentally friendly purchases.",
    rate: "4.99% p.a.",
    comparison: "5.35% p.a.",
  },
  {
    name: "Student Personal Loan",
    text: "A loan for all higher education students and apprentices.",
    rate: "6.79% p.a.",
    comparison: "6.95% p.a.",
  },
];

const unsecured = [
  {
    name: "Personal Loan",
    text: "Great for your dream holiday or any number of needs where you don't offer security.",
    rate: "12.79% p.a.",
    comparison: "14.89% p.a.",
  },
  {
    name: "Green Personal Loan",
    text: "Ideal for solar hot water, grey water treatment systems or energy saving white goods.",
    rate: "6.99% p.a.",
    comparison: "8.01% p.a.",
  },
  {
    name: "Student Personal Loan",
    text: "A loan for your dream holiday or any number of needs where you don't have security.",
    rate: "9.99% p.a.",
    comparison: "9.99% p.a.",
  },
];

const tools = [
  { icon: Calculator, label: "Personal loan repayments calculator" },
  { icon: Percent, label: "Personal loan interest rates" },
  { icon: TrendingUp, label: "Check your borrowing power" },
];

function LoanCard({
  name,
  text,
  rate,
  comparison,
}: {
  name: string;
  text: string;
  rate: string;
  comparison: string;
}) {
  return (
    <div className="flex flex-col rounded-2xl border border-border bg-card p-6">
      <h3 className="font-heading text-lg font-medium text-foreground">
        {name}
      </h3>
      <p className="mt-2 text-sm text-muted-foreground">{text}</p>
      <div className="mt-4 space-y-1 text-sm font-semibold text-primary">
        <p>Rate: {rate}</p>
        <p>Comparison rate*: {comparison}</p>
      </div>
    </div>
  );
}

export default function PersonalPage() {
  return (
    <>
      <PageHero
        title="Personal loans"
        subtitle="Bringing your plans to life."
        image="https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80"
        align="left"
      >
        <Link
          href="/personal/enquiry"
          className={buttonVariants({
            className:
              "mt-2 h-12 rounded-full px-8 text-base bg-[var(--accent)] text-[var(--accent-foreground)] hover:bg-[var(--accent)] hover:opacity-90 font-semibold",
          })}
        >
          Make an enquiry
        </Link>
      </PageHero>

      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "Personal loans" }]}
      />

      <section className="border-b border-border bg-muted py-12">
        <div className="mx-auto w-full max-w-6xl px-6">
          <h2 className="font-heading text-xl font-medium text-foreground">
            Apply for your personal loan
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
            {quickLinks.map((link) => (
              <div
                key={link.label}
                className="flex flex-col items-center rounded-lg border border-border bg-card p-4 text-center transition-colors hover:bg-muted"
              >
                <link.icon className="mb-2 size-7 text-primary" strokeWidth={1.5} />
                <span className="text-sm">{link.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto w-full max-w-6xl px-6">
          <h2 className="text-balance text-3xl tracking-[-0.03em] text-foreground md:text-4xl">
            Our personal loans come with a range of benefits
          </h2>
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="card-hover flex flex-col rounded-2xl border border-border bg-card p-6"
              >
                <span className="grid size-11 place-items-center rounded-xl bg-[var(--lilac)] text-[var(--primary-deep)]">
                  <benefit.icon className="size-5" strokeWidth={1.5} />
                </span>
                <h3 className="font-heading mt-4 text-lg font-medium text-foreground">
                  {benefit.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {benefit.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-muted py-16">
        <div className="mx-auto w-full max-w-6xl px-6">
          <h2 className="text-2xl tracking-tight text-foreground md:text-3xl">
            Secured personal loan comparison
          </h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            A secured personal loan is a loan guaranteed by an asset, such as a
            car. Having security means we can offer a lower interest rate for
            the loan.
          </p>
          <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-3">
            {secured.map((loan) => (
              <LoanCard key={loan.name} {...loan} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto w-full max-w-6xl px-6">
          <h2 className="text-2xl tracking-tight text-foreground md:text-3xl">
            Unsecured personal loan comparison
          </h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            An unsecured loan means that you don&apos;t need to provide any
            security.
          </p>
          <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-3">
            {unsecured.map((loan) => (
              <LoanCard key={loan.name} {...loan} />
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-muted py-16">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 md:flex-row">
          <div className="flex-1">
            <h2 className="text-2xl tracking-tight text-foreground md:text-3xl">
              Calculators &amp; tools
            </h2>
            <p className="mt-3 text-muted-foreground">
              Use our tools and calculators to help compare and select the right
              personal loan for you.
            </p>
            <Link
              href="/personal/enquiry"
              className={buttonVariants({
                className:
                  "mt-6 h-12 rounded-full px-8 text-base bg-[var(--accent)] text-[var(--accent-foreground)] hover:bg-[var(--accent)] hover:opacity-90 font-semibold",
              })}
            >
              Make an enquiry
            </Link>
          </div>
          <div className="grid flex-1 grid-cols-1 gap-6 sm:grid-cols-2">
            {tools.map((tool) => (
              <div
                key={tool.label}
                className="flex flex-col items-center rounded-lg border border-border bg-card p-4 text-center transition-colors hover:bg-muted"
              >
                <tool.icon className="mb-2 size-7 text-primary" strokeWidth={1.5} />
                <span className="text-sm">{tool.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-10 px-6 md:grid-cols-2">
          <div>
            <h2 className="text-2xl tracking-tight text-foreground">
              How to apply for a loan
            </h2>
            <ul className="mt-4 list-disc space-y-2 pl-6 text-muted-foreground">
              <li>Select the loan that is most suited to you</li>
              <li>
                <Link href="/login" className="text-primary hover:underline">
                  Apply online
                </Link>{" "}
                or{" "}
                <Link href="/contact-us" className="text-primary hover:underline">
                  contact us
                </Link>
              </li>
              <li>
                Send supporting documentation so that we can finalise your
                application
              </li>
              <li>
                Receive a response to your application and you&apos;ll be one
                step closer to getting that new car, holiday, caravan, home
                improvements — whatever it is, in no time at all.
              </li>
            </ul>
          </div>
          <div>
            <h2 className="text-2xl tracking-tight text-foreground">
              Personal loan pre-application
            </h2>
            <details className="group mt-4 rounded-2xl border border-border bg-card">
              <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4 font-semibold text-foreground">
                Show details
                <span className="text-primary">+</span>
              </summary>
              <div className="space-y-4 border-t border-border px-5 py-4 text-sm text-muted-foreground">
                <p>
                  Desperate for a holiday? Or to dive into an adventure? Driven
                  to buy your next car? Or dreaming of a home makeover? A Ally personal loan can make it happen. Applying online is
                  quick and easy.
                </p>
                <p>
                  To be eligible, you need to be over 18, a US citizen or
                  permanent resident, employed, or have a regular income, not
                  bankrupt or in financial hardship. If you receive government
                  benefits, it&apos;s best to call us.
                </p>
                <p>
                  You&apos;ll need identification, income and employment
                  details, asset details, expenses, and details around any debts
                  you have. Now you&apos;ve got your info, it&apos;s time to
                  apply. It&apos;s fast — taking around 10 to 20 minutes to
                  complete online.
                </p>
              </div>
            </details>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-muted py-12">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-6 px-6 md:flex-row md:items-center">
          <h2 className="text-2xl tracking-tight text-foreground md:text-3xl">
            Looking to switch your personal loan to Ally?
          </h2>
          <Link
            href="/switch"
            className={buttonVariants({
              className:
                "h-12 shrink-0 rounded-full px-8 text-base bg-[var(--accent)] text-[var(--accent-foreground)] hover:bg-[var(--accent)] hover:opacity-90 font-semibold",
            })}
          >
            Switch now
          </Link>
        </div>
      </section>

      <section className="relative flex min-h-[220px] items-center overflow-hidden md:min-h-[330px]">
        <div
          aria-hidden
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1560472354-b33ff0c44a43?auto=format&fit=crop&w=1200&q=80')",
          }}
        />
        <div aria-hidden className="absolute inset-0 bg-black/55 dark:bg-black/75" />
        <div className="relative z-10 mx-auto w-full max-w-5xl px-6 py-8">
          <div className="flex flex-col items-start gap-4">
            <h2 className="text-2xl font-extralight tracking-[-0.03em] text-white md:text-3xl">
              Car insurance
            </h2>
            <p className="max-w-xl text-white/90">
              Insurance is about protecting your future. Get cover for what you
              love today.
            </p>
            <Link
              href="/personal"
              className={buttonVariants({
                className:
                  "h-12 rounded-full px-8 text-base bg-[var(--accent)] text-[var(--accent-foreground)] hover:bg-[var(--accent)] hover:opacity-90 font-semibold",
              })}
            >
              Learn more
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-muted py-16">
        <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-10 px-6 md:grid-cols-2">
          <div>
            <h2 className="text-xl tracking-tight text-foreground">
              Things you should know
            </h2>
          </div>
          <div className="space-y-4 text-sm text-muted-foreground">
            <p>
              <Link
                href="/important-info"
                className="text-primary hover:underline"
              >
                Terms and conditions, fees and charges
              </Link>{" "}
              apply. All information including interest rate is subject to
              change without notice. Full details available on application.
              Lending criteria apply.
            </p>
            <p>
              <sup>*</sup>
              <strong> Important information about comparison rate:</strong> The
              comparison rates displayed are calculated for secured personal
              loans with a loan amount of $30,000 and a term of 5 years, for
              unsecured personal loans the loan amount is $10,000 with a term of
              3 years.
            </p>
            <p>
              <strong>WARNING:</strong> This comparison rate is true only for
              the examples given and may not include all fees and charges.
              Different terms, fees or other loan amounts might result in a
              different comparison rate.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
