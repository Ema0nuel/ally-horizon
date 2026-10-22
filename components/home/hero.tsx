"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";

type Banner = {
  title: string;
  desc: string;
  img: string;
  cta: string;
  ctaLink: string;
};

const banners: Banner[] = [
  {
    title: "Express Home Loan: Fast, Flexible, Yours.",
    desc: "Get approved in as little as 24 hours. Enjoy competitive rates, flexible repayments, and a dedicated team to guide you home.",
    img: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1600&q=80",
    cta: "Apply now",
    ctaLink: "/login",
  },
  {
    title: "Your Dream Home Awaits.",
    desc: "Unlock exclusive member rates and personalized support. Start your journey with Ally today.",
    img: "https://images.unsplash.com/photo-1565688534245-05d6b5be184a?auto=format&fit=crop&w=1600&q=80",
    cta: "Start now",
    ctaLink: "/register",
  },
  {
    title: "Refinance & Save Big.",
    desc: "Switch your home loan and save with our low rates and zero application fees. See how much you could save in minutes.",
    img: "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1600&q=80",
    cta: "See savings",
    ctaLink: "/login",
  },
];

export function Hero() {
  const [index, setIndex] = useState(0);
  const reduce = useReducedMotion();
  const banner = banners[index];

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % banners.length), 7000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto w-full max-w-[1400px] px-0 py-10 md:py-12 lg:px-16">
        <div className="relative flex min-h-[36rem] items-center overflow-hidden rounded-none bg-[var(--primary-deep)] lg:min-h-[40rem] lg:rounded-[2rem]">
          {/* Photo runs as background on the right, Ally style, fading into the block */}
          <AnimatePresence initial={false}>
            <motion.div
              key={index}
              className="absolute inset-y-0 right-0 w-full lg:w-[58%]"
              initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.06 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
            >
              <Image
                src={banner.img}
                alt=""
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="object-cover"
              />
            </motion.div>
          </AnimatePresence>

          {/* Mobile: photo is the main background, no scrim over it */}
          <div
            aria-hidden
            className="absolute inset-0 hidden lg:block"
            style={{
              background:
                "linear-gradient(90deg, var(--primary-deep) 0%, var(--primary-deep) 36%, color-mix(in srgb, var(--primary-deep) 55%, transparent) 54%, transparent 78%)",
            }}
          />

          {/* Mobile: content rides on a gradient card over the photo. Desktop: plain column, untouched. */}
          <div className="relative z-10 mx-5 my-8 flex flex-1 flex-col gap-8 rounded-3xl bg-gradient-to-br from-[var(--primary-deep)] to-[var(--primary)] px-7 py-10 shadow-[0_24px_48px_-16px_rgba(0,0,0,0.5)] lg:mx-0 lg:my-0 lg:w-[56%] lg:flex-none lg:rounded-none lg:bg-none lg:px-16 lg:py-24 lg:shadow-none">
            <div className="relative w-full min-h-[16rem] overflow-hidden md:min-h-[18rem]">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div
                  key={index}
                  initial={reduce ? { opacity: 0 } : { y: "100%" }}
                  animate={reduce ? { opacity: 1 } : { y: "0%" }}
                  exit={reduce ? { opacity: 0 } : { y: "-100%" }}
                  transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
                  className="flex flex-col gap-6"
                >
                  <h1 className="text-balance text-4xl leading-[0.95] font-extralight tracking-[-0.04em] text-white sm:text-5xl lg:text-6xl">
                    {banner.title}
                  </h1>
                  <p className="max-w-xl text-lg leading-relaxed text-white/85 md:text-xl">
                    {banner.desc}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href={banner.ctaLink}
                className={buttonVariants({
                  className:
                    "h-12 rounded-full px-7 text-base bg-[var(--accent)] text-[var(--accent-foreground)] hover:bg-[var(--accent)] hover:opacity-90 font-semibold",
                })}
              >
                {banner.cta}
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/personal"
                className={buttonVariants({
                  className:
                    "h-12 rounded-full px-7 text-base bg-white text-[var(--primary-deep)] hover:bg-white hover:opacity-90 font-semibold",
                })}
              >
                Explore products
              </Link>
            </div>

            <div className="flex items-center gap-2">
              {banners.map((_, i) => (
                <button
                  key={i}
                  aria-label={`Show banner ${i + 1}`}
                  onClick={() => setIndex(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === index
                      ? "w-8 bg-[var(--accent)]"
                      : "w-3 bg-white/35 hover:bg-white/60"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
