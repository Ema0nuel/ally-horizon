import type { Metadata } from "next";

const rawUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/+$/, "");

export const siteUrl = rawUrl || "https://allybanks.cc";

export const siteConfig = {
  name: "Ally",
  url: siteUrl,
  tagline: "Premium Banking Reimagined",
  description:
    "Experience modern banking with Ally. Secure, fast, and beautifully designed for the way you live.",
  contactEmail: process.env.CONTACT_EMAIL || "support@allybanks.cc",
  phone: "+1 (210) 279-5532",
  phoneHref: "+12102795532",
} as const;

type BuildMetadataArgs = {
  title: string;
  description: string;
  path?: string;
  absolute?: boolean;
};

export function buildMetadata({
  title,
  description,
  path = "/",
  absolute = false,
}: BuildMetadataArgs): Metadata {
  const url = new URL(path, siteUrl).toString();

  return {
    title: absolute ? { absolute: title } : title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "website",
      url,
      siteName: siteConfig.name,
      title,
      description,
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
