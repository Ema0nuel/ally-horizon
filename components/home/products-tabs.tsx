"use client";

import Link from "next/link";
import {
  ArrowRight,
  Briefcase,
  Calculator,
  ClipboardCheck,
  House,
  PiggyBank,
  ShieldCheck,
  TrendingUp,
  Wallet,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Reveal } from "./reveal";

const productGroups = [
  {
    icon: House,
    title: "Loans",
    items: [
      "Home Loans",
      "Pre-qualify for a home loan",
      "Personal Loans",
    ],
  },
  {
    icon: PiggyBank,
    title: "Accounts",
    items: ["Savings Accounts", "Transaction Accounts", "Term Deposits"],
  },
  {
    icon: TrendingUp,
    title: "Investing & Super",
    items: ["Investing", "Superannuation & retirement"],
  },
  {
    icon: Briefcase,
    title: "Business",
    items: ["All business products", "Talk to a business specialist"],
  },
  {
    icon: ShieldCheck,
    title: "Insurance",
    items: ["Personal Insurance", "Commercial Insurance", "Life Insurance"],
  },
];

const rates = [
  {
    name: "Complete Home Loan",
    type: "Variable",
    desc: "The flexibility you want, with the features you need.",
    value: "5.44%",
    note: "Comparison rate 5.67% p.a.",
  },
  {
    name: "iStandard Credit Card",
    type: "Credit card",
    desc: "$0 annual fee with platinum travel perks.",
    value: "19.99%",
    note: "Annual fee $0",
  },
  {
    name: "Secured Personal Loan",
    type: "Personal loan",
    desc: "Perfect for a new or used car, or refinancing an existing loan.",
    value: "7.79%",
    note: "Comparison rate 8.51% p.a.",
  },
  {
    name: "Special Term Deposit",
    type: "Term deposit",
    desc: "Great rates so you can watch your money grow.",
    value: "3.75%",
    note: "Minimum deposit $5,000",
  },
];

const tools = [
  {
    icon: ClipboardCheck,
    title: "Pre-qualify for a home loan",
    cta: "Start now",
  },
  {
    icon: Calculator,
    title: "Check your borrowing power",
    cta: "Calculate",
  },
  {
    icon: Wallet,
    title: "Foreign exchange calculator",
    cta: "Try now",
  },
];

export function ProductsTabs() {
  return (
    <section id="products" className="scroll-mt-20">
      <div className="mx-auto w-full max-w-[1400px] px-6 py-20 md:px-12 md:py-32 lg:px-16">
        <Reveal className="mb-12 max-w-2xl">
          <h2 className="text-balance text-3xl tracking-[-0.03em] text-foreground md:text-5xl">
            Banking, reimagined around you.
          </h2>
          <p className="mt-4 text-base text-muted-foreground md:text-lg">
            From everyday accounts to the home you&apos;ve been dreaming of,
            find the product that fits the way you live.
          </p>
        </Reveal>

        <Tabs defaultValue="products">
          <Reveal>
            <TabsList variant="line" className="mb-10 w-full justify-start gap-1 overflow-x-auto rounded-none border-b border-border pb-px">
              <TabsTrigger value="products" className="rounded-full px-4 py-2">
                Products
              </TabsTrigger>
              <TabsTrigger value="rates" className="rounded-full px-4 py-2">
                Interest Rates
              </TabsTrigger>
              <TabsTrigger value="tools" className="rounded-full px-4 py-2">
                Calculators &amp; tools
              </TabsTrigger>
            </TabsList>
          </Reveal>

          <TabsContent value="products">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {productGroups.map((group, i) => (
                <Reveal key={group.title} delay={i * 0.05}>
                  <Card className="card-hover h-full">
                    <CardHeader>
                      <span className="grid size-11 place-items-center rounded-xl bg-[var(--lilac)] text-[var(--primary-deep)]">
                        <group.icon className="size-5" strokeWidth={1.5} />
                      </span>
                      <CardTitle className="mt-3 text-lg">{group.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="flex flex-col gap-1">
                        {group.items.map((item) => (
                          <li
                            key={item}
                            className="rounded-lg px-2 py-1.5 text-sm text-muted-foreground"
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </Reveal>
              ))}
              <Reveal delay={0.25}>
                <Card className="card-hover flex h-full flex-col justify-between bg-primary text-white ring-0">
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Not sure where to start?
                    </CardTitle>
                    <CardDescription className="text-white/70">
                      Explore every product and service in one place.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link
                      href="/personal"
                      className="inline-flex items-center gap-2 text-sm font-semibold text-white hover:underline"
                    >
                      View all products
                      <ArrowRight className="size-4" />
                    </Link>
                  </CardContent>
                </Card>
              </Reveal>
            </div>
          </TabsContent>

          <TabsContent value="rates">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {rates.map((rate, i) => (
                <Reveal key={rate.name} delay={i * 0.05}>
                  <Card className="card-hover h-full">
                    <CardHeader>
                      <Badge variant="secondary" className="w-fit">
                        {rate.type}
                      </Badge>
                      <CardTitle className="mt-2 text-base">{rate.name}</CardTitle>
                      <CardDescription>{rate.desc}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-4xl tracking-tight text-primary">
                        {rate.value}
                        <span className="ml-1 text-base text-muted-foreground">
                          p.a.
                        </span>
                      </div>
                      <p className="mt-3 text-sm text-muted-foreground">{rate.note}</p>
                    </CardContent>
                  </Card>
                </Reveal>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="tools">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {tools.map((tool, i) => (
                <Reveal key={tool.title} delay={i * 0.05}>
                  <Card className="card-hover h-full">
                    <CardHeader>
                      <span className="grid size-11 place-items-center rounded-xl bg-[var(--lilac)] text-[var(--primary-deep)]">
                        <tool.icon className="size-5" strokeWidth={1.5} />
                      </span>
                      <CardTitle className="mt-3 text-lg">{tool.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Link
                        href="/personal"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
                      >
                        {tool.cta}
                        <ArrowRight className="size-4" />
                      </Link>
                    </CardContent>
                  </Card>
                </Reveal>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
