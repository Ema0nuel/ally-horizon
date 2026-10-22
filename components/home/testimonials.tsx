import { Quote } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Reveal } from "./reveal";

const testimonials = [
  {
    quote:
      "Switching to Ally was the best decision for my family. The process was smooth and the rates are unbeatable.",
    name: "James R.",
    role: "Home loan member",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    quote:
      "I love the online tools and how easy it is to manage my accounts. The support team is always helpful.",
    name: "Maria S.",
    role: "Everyday banking",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    quote:
      "Great experience refinancing my home. The team explained everything and I saved a lot.",
    name: "David L.",
    role: "Refinance member",
    avatar: "https://randomuser.me/api/portraits/men/65.jpg",
  },
];

export function Testimonials() {
  return (
    <section className="border-t border-border bg-muted">
      <div className="mx-auto w-full max-w-[1400px] px-6 py-20 md:px-12 md:py-32 lg:px-16">
        <Reveal className="mb-12 max-w-2xl">
          <h2 className="text-balance text-3xl tracking-[-0.03em] text-foreground md:text-5xl">
            What our members say.
          </h2>
          <p className="mt-4 text-base text-muted-foreground md:text-lg">
            Real stories from people who made the switch.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.08} className="h-full">
              <Card
                className={cn(
                  "card-hover relative h-full",
                  i === 1 && "md:-translate-y-4"
                )}
              >
                <Quote
                  className="absolute right-6 top-6 size-8 text-primary/30"
                  strokeWidth={1}
                  aria-hidden
                />
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Avatar size="lg">
                      <AvatarImage src={t.avatar} alt={t.name} />
                      <AvatarFallback>
                        {t.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-base leading-relaxed text-foreground">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
