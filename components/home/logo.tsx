import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2", className)}>
      <Image
        src="/images/logo.png"
        alt="Ally logo"
        width={0}
        height={0}
        sizes="100vw"
        priority
        className="h-8 w-auto dark:hidden"
      />
      <Image
        src="/images/logo.png"
        alt="Ally logo"
        width={0}
        height={0}
        sizes="100vw"
        priority
        className="hidden h-8 w-auto dark:block"
      />
      <span className="ml-1 font-heading text-base font-bold text-primary">
        Ally
      </span>
    </Link>
  );
}
