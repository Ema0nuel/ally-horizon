"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/format";
import { cn } from "@/lib/utils";

export function UserAvatar({
  name,
  email,
  src,
  className,
}: {
  name?: string | null;
  email?: string | null;
  src?: string | null;
  className?: string;
}) {
  const fallback = getInitials(name || email) || "U";
  return (
    <Avatar className={cn("bg-primary/10 text-primary", className)}>
      {src ? <AvatarImage src={src} alt={name || email || "User"} /> : null}
      <AvatarFallback className="bg-primary/10 text-primary">{fallback}</AvatarFallback>
    </Avatar>
  );
}
