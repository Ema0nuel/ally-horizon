import Image from "next/image";

import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <>
      <Image
        src="/images/logo.png"
        alt="Ally"
        width={0}
        height={0}
        sizes="100vw"
        className={cn("h-16 w-auto dark:hidden", className)}
      />
      <Image
        src="/images/logo.png"
        alt="Ally"
        width={0}
        height={0}
        sizes="100vw"
        className={cn("hidden h-16 w-auto dark:block", className)}
      />
    </>
  );
}
