import type { LucideIcon } from "lucide-react";
import {
  ArrowDownToLine,
  ArrowLeftRight,
  CreditCard,
  History,
  Landmark,
  LayoutDashboard,
  Settings,
  User,
} from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  children?: NavItem[];
};

/** Bottom navigation (mobile) — five core destinations. */
export const dashboardNav: NavItem[] = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Cards", href: "/dashboard/cards", icon: CreditCard },
  { label: "History", href: "/dashboard/history", icon: History },
  { label: "Transfers", href: "/dashboard/transfers", icon: ArrowLeftRight },
  { label: "Profile", href: "/dashboard/profile", icon: User },
];

/** Desktop sidebar navigation, including submenu groups. */
export const sidebarNav: NavItem[] = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Cards", href: "/dashboard/cards", icon: CreditCard },
  { label: "History", href: "/dashboard/history", icon: History },
  {
    label: "Transfers",
    href: "/dashboard/transfers",
    icon: ArrowLeftRight,
    children: [
      { label: "Local", href: "/dashboard/transfers/local", icon: ArrowLeftRight },
      { label: "Wire", href: "/dashboard/transfers/wire", icon: ArrowLeftRight },
      { label: "Interbank", href: "/dashboard/transfers/interbank", icon: ArrowLeftRight },
    ],
  },
  { label: "Deposit", href: "/dashboard/deposit", icon: ArrowDownToLine },
  { label: "Loans", href: "/dashboard/loans", icon: Landmark },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
  { label: "Profile", href: "/dashboard/profile", icon: User },
];

export function isActivePath(href: string, pathname: string): boolean {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname === href || pathname.startsWith(href + "/");
}
