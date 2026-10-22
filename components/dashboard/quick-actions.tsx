import Link from "next/link";
import { ArrowDownToLine, ArrowLeftRight, History, Landmark } from "lucide-react";

const actions = [
  { label: "Transfer", href: "/dashboard/transfers", icon: ArrowLeftRight },
  { label: "Deposit", href: "/dashboard/deposit", icon: ArrowDownToLine },
  { label: "History", href: "/dashboard/history", icon: History },
  { label: "Loan", href: "/dashboard/loans", icon: Landmark },
];

export function QuickActions() {
  return (
    <section>
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Quick actions
      </h2>
      <div className="grid grid-cols-4 gap-3">
        {actions.map(({ label, href, icon: Icon }, i) => (
          <Link
            key={label}
            href={href}
            style={{ animationDelay: `${i * 50}ms` }}
            className="group animate-fade-in-up flex flex-col items-center gap-2.5 rounded-2xl border border-border bg-card p-4 text-center transition-transform duration-200 ease-out hover:-translate-y-0.5 hover:border-primary/40 hover:bg-[var(--lilac)]/50 active:scale-[0.97]"
          >
            <span className="flex size-11 items-center justify-center rounded-full bg-[var(--lilac)] text-[var(--primary-deep)] transition-transform duration-200 ease-out group-hover:scale-105">
              <Icon className="size-5" strokeWidth={1.8} />
            </span>
            <span className="text-xs font-semibold text-foreground">
              {label}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
