import { BadgeCheck, Landmark, ShieldCheck } from "lucide-react";

import { Reveal } from "./reveal";

const proofs = [
  {
    icon: Landmark,
    title: "One of the US's biggest financial groups",
    value: "$120B+",
    label: "assets under management",
  },
  {
    icon: BadgeCheck,
    title: "One of the most trusted brands",
    value: "1.9M",
    label: "members nationwide",
  },
  {
    icon: ShieldCheck,
    title: "Bank-grade security",
    value: "24/7",
    label: "fraud monitoring",
  },
];

export function TrustBar() {
  return (
    <section className="border-y border-border bg-muted">
      <div className="mx-auto grid w-full max-w-[1400px] grid-cols-1 divide-y divide-border px-6 py-12 md:grid-cols-3 md:divide-x md:divide-y-0 md:px-12 md:py-16 lg:px-16">
        {proofs.map((proof, i) => (
          <Reveal
            key={proof.title}
            delay={i * 0.08}
            className="flex items-center gap-5 px-4 py-6 md:justify-center md:py-0"
          >
            <span className="grid size-12 shrink-0 place-items-center rounded-full bg-[var(--lilac)] text-[var(--primary-deep)]">
              <proof.icon className="size-6" strokeWidth={1.5} />
            </span>
            <span className="flex flex-col">
              <span className="text-2xl leading-none tracking-tight text-foreground md:text-3xl">
                {proof.value}
              </span>
              <span className="mt-1.5 text-sm text-muted-foreground">
                {proof.title}
              </span>
            </span>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
