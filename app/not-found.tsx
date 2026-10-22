import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Navbar } from "@/components/home/navbar";
import { Footer } from "@/components/home/footer";
import { buttonVariants } from "@/components/ui/button";
import { buildMetadata } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Page Not Found",
  description:
    "The page you are looking for could not be found. Return to the Ally homepage.",
  path: "/404",
});

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="flex min-h-[70vh] flex-col items-center justify-center px-6 py-16 text-center">
        <Image
          src="/images/errorPage/page_not_found.svg"
          alt="Page not found"
          width={0}
          height={0}
          sizes="100vw"
          priority
          className="mb-8 h-auto max-w-md w-full object-contain"
        />
        <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          This page does not exist
        </h1>
        <p className="mt-3 max-w-xl text-base text-muted-foreground">
          Sorry, the page you are looking for could not be found. It was likely
          moved, renamed, or never existed.
        </p>
        <Link
          href="/"
          className={buttonVariants({
            className: "mt-8 h-11 rounded-full px-6",
          })}
        >
          <ArrowLeft className="size-4" />
          Back to home
        </Link>
      </main>
      <Footer />
    </>
  );
}
