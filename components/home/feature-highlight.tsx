import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Reveal } from "./reveal";

const points = [
  "Competitive rates with no hidden fees",
  "Dedicated specialists, one call away",
  "Switch in minutes, not weeks",
];

export function FeatureHighlight() {
  return (
    <section id="about" className="scroll-mt-20 border-t border-border">
      <div className="mx-auto grid w-full max-w-[1400px] grid-cols-1 items-center gap-12 px-6 py-20 md:px-12 md:py-32 lg:grid-cols-2 lg:px-16">
        <Reveal>
          <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-3xl ring-1 ring-border shadow-[0_30px_60px_-20px_rgba(0,0,0,0.5)] lg:max-w-none lg:aspect-[4/5]">
            <Image
              src="/images/user/util2.jpg"
              alt="A better home loan experience with Ally"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          </div>
        </Reveal>

        <Reveal delay={0.1} className="flex flex-col items-center gap-7 text-center">
          <h2 className="text-balance text-3xl tracking-[-0.03em] text-foreground md:text-5xl">
            A better home loan experience starts here.
          </h2>
          <p className="max-w-xl text-base text-muted-foreground md:text-lg">
            Join the 1.9 million members already benefiting from our competitive
            rates and trusted services.
          </p>

          <ul className="flex flex-col gap-3">
            {points.map((point) => (
              <li
                key={point}
                className="flex items-center justify-center gap-3 text-sm md:text-base"
              >
                <CheckCircle2
                  className="size-5 shrink-0 text-primary"
                  strokeWidth={1.5}
                />
                <span className="text-foreground">{point}</span>
              </li>
            ))}
          </ul>

          <Link
            href="/switch"
            className={buttonVariants({
              className:
                "h-12 rounded-full px-7 text-base bg-[var(--accent)] text-[var(--accent-foreground)] hover:bg-[var(--accent)] hover:opacity-90 font-semibold",
            })}
          >
            Switch today
            <ArrowRight className="size-4" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
