import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { HandCoins, House, Users } from "lucide-react";

import { PageHero } from "@/components/site/page-hero";
import { buttonVariants } from "@/components/ui/button";
import { buildMetadata } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "About Us",
  description:
    "Learn about Ally, the better big bank. Discover our history of firsts, our commitment to customers and community, and the values that guide everything we do.",
  path: "/about",
});

const stats = [
  { icon: Users, label: "Caring for 1.9 million customers" },
  { icon: HandCoins, label: "$272 million reinvested back into local communities" },
  { icon: House, label: "The nation's most satisfied home loan customers*" },
];

const features = [
  {
    title: "Solutions that fit everyone",
    subtitle: "Accessibility & inclusion",
    img: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=1200&q=80",
    text: "We value all abilities and capabilities. So, we want our products, services and workplace to be accessible to all people.",
    details:
      "Our commitment to accessibility means we continually improve our services and facilities to ensure everyone can bank with confidence, regardless of ability.",
  },
  {
    title: "Understand our decisions",
    subtitle: "Environment, social & governance",
    img: "https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?auto=format&fit=crop&w=1200&q=80",
    text: "Our ESG reflects our responsibility to customers, shareholders and the communities in which we are part of.",
    details:
      "We integrate ESG principles into our business, striving for positive environmental impact, social responsibility, and strong governance.",
  },
  {
    title: "Join our team",
    subtitle: "Careers at Ally",
    img: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
    text: "Ally is the bank you can be proud to work at. We're big enough to offer you every opportunity, but not so big that we lose the community feel.",
    details:
      "Explore rewarding career opportunities and become part of a team that values growth, diversity, and making a difference.",
  },
  {
    title: "Your money is protected",
    subtitle: "Financial Claims Scheme",
    img: "https://images.unsplash.com/photo-1544378730-8b5104b18790?auto=format&fit=crop&w=1200&q=80",
    text: "The Financial Claims Scheme (FCS) provides protection and quick access to deposits in the unlikely event that a financial institution fails.",
    details:
      "With the FCS, your deposits are protected up to the government guarantee limit, giving you peace of mind.",
  },
  {
    title: "We have high standards",
    subtitle: "Codes of Practice",
    img: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80",
    text: "We pride ourselves on conducting business ethically and to the highest possible standard, complying with a range of codes of practice.",
    details:
      "Our codes of practice ensure transparency, fairness, and integrity in all our dealings with customers and the community.",
  },
  {
    title: "How we're performing",
    subtitle: "Ally Investor Centre",
    img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
    text: "Information on our securities, financial results, announcements, sustainability reporting and other disclosures.",
    details:
      "Stay informed about our financial performance, sustainability initiatives, and investor updates.",
  },
];

const goals = [
  {
    title: "Buying a home",
    img: "https://images.unsplash.com/photo-1623282033815-40b05d96c903?auto=format&fit=crop&w=1200&q=80",
    details:
      "Whether you're a first home buyer or looking to upgrade, we offer flexible home loan solutions, expert advice, and support every step of the way.",
  },
  {
    title: "Buying with credit",
    img: "https://images.unsplash.com/photo-1521791055366-0d553872125f?auto=format&fit=crop&w=1200&q=80",
    details:
      "Our credit card options are designed to suit your lifestyle, with competitive rates, rewards, and security for your everyday purchases.",
  },
  {
    title: "Managing your money",
    img: "/images/user/util2.jpg",
    details:
      "From everyday accounts to budgeting tools, we help you stay in control of your finances with easy access and smart features.",
  },
  {
    title: "Saving for what's important",
    img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=1200&q=80",
    details:
      "Reach your savings goals faster with our range of high-interest savings accounts and flexible deposit options.",
  },
  {
    title: "Protecting what you love",
    img: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=1200&q=80",
    details:
      "Safeguard your family, home, and valuables with our comprehensive insurance products tailored to your needs.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        title="The better big bank"
        subtitle="When you're a big bank, you have big responsibilities. The biggest of which is to do the right thing. It's something we've always been good at."
        image="https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=80"
        showLogo
      />

      <section className="border-b border-border bg-muted">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-center gap-6 px-6 py-8 md:flex-row md:gap-10">
          {stats.map((stat) => (
            <div key={stat.label} className="flex items-center gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-card shadow-sm">
                <stat.icon className="size-5 text-primary" strokeWidth={1.5} />
              </span>
              <span className="text-base font-semibold text-foreground">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-8 px-6 md:flex-row md:items-start">
          <div className="max-w-2xl">
            <h2 className="text-balance text-3xl tracking-[-0.03em] text-foreground md:text-4xl">
              Welcome to Ally
            </h2>
            <p className="mt-6 space-y-4 text-base leading-relaxed text-muted-foreground md:text-lg">
              <span className="block">
                We&apos;re a credit union that&apos;s good with money, but
                we&apos;re more interested in the good that money can do.
              </span>
              <span className="block">
                Since we first opened our doors, every decision we&apos;ve made,
                every product we&apos;ve created, every service we&apos;ve
                provided, has been in the best interests of our members,
                partners and people.
              </span>
              <span className="block">
                Throughout this time, we have been innovative, competitive, and
                accessible. Providing you with everything you need to achieve
                your financial goals, while supporting the communities in which
                we live.
              </span>
            </p>
          </div>
          <Link
            href="/switch"
            className={buttonVariants({
              className:
                "h-12 rounded-full px-8 text-base bg-[var(--accent)] text-[var(--accent-foreground)] hover:bg-[var(--accent)] hover:opacity-90 font-semibold",
            })}
          >
            Try Ally
          </Link>
        </div>
      </section>

      <section className="border-y border-border bg-muted py-16">
        <div className="mx-auto w-full max-w-4xl px-6">
          <h2 className="text-2xl tracking-tight text-foreground md:text-3xl">
            A history of firsts
          </h2>
          <p className="mt-4 text-base text-muted-foreground md:text-lg">
            As one of the region&apos;s most trusted credit unions, we&apos;ve
            delivered many firsts over the years.
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-6 text-base text-muted-foreground md:text-lg">
            <li>
              First to introduce green loans and home loan offset accounts.
            </li>
            <li>
              First globally to offer a digital home loan application in
              partnership with online fintechs.
            </li>
            <li>
              First to introduce Community Banking, returning profits to the
              people and communities that generate them.
            </li>
          </ul>
          <p className="mt-6 text-base text-muted-foreground md:text-lg">
            As we continue to grow, we continue to innovate — investing in
            technology, accessibility, and service to create a better banking
            experience for you.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto w-full max-w-6xl px-6">
          <h2 className="text-balance text-center text-3xl tracking-[-0.03em] text-foreground md:text-4xl">
            Learn more about us
          </h2>
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <article
                key={feature.title}
                className="card-hover flex flex-col rounded-2xl border border-border bg-card p-6"
              >
                <div className="overflow-hidden rounded-lg">
                  <Image
                    src={feature.img}
                    alt={feature.title}
                    width={600}
                    height={400}
                    className="h-40 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <h3 className="font-heading mt-4 text-lg font-medium text-foreground">
                  {feature.title}
                </h3>
                <p className="mt-1 text-sm font-semibold text-primary">
                  {feature.subtitle}
                </p>
                <p className="mt-3 text-sm text-muted-foreground">
                  {feature.text}
                </p>
                <details className="group mt-4 border-t border-border pt-3">
                  <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-foreground">
                    <span className="grid size-6 place-items-center rounded-full border border-primary text-base leading-none">
                      +
                    </span>
                    Show details
                  </summary>
                  <p className="mt-3 text-sm text-muted-foreground">
                    {feature.details}
                  </p>
                </details>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-muted py-16">
        <div className="mx-auto w-full max-w-6xl px-6">
          <h2 className="text-balance text-center text-3xl tracking-[-0.03em] text-foreground md:text-4xl">
            What&apos;s your goal?
          </h2>
          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {goals.map((goal) => (
              <article
                key={goal.title}
                className="card-hover flex flex-col rounded-2xl border border-border bg-card p-6"
              >
                <div className="overflow-hidden rounded-lg">
                  <Image
                    src={goal.img}
                    alt={goal.title}
                    width={600}
                    height={400}
                    className="h-40 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="mt-4">
                  <h3 className="font-heading text-lg font-medium text-foreground">
                    {goal.title}
                  </h3>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">
                  {goal.details}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
