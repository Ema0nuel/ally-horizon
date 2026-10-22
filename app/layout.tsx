import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { siteConfig, siteUrl } from "@/lib/site";
import { AuthProvider } from "@/components/auth/auth-provider";
import { LanguageProvider } from "@/components/language-provider";

/* Figtree: bundled open-source fallback for Ally's "TruthSans".
   Font stacks put "TruthSans" first (see globals.css); Figtree renders
   everything when TruthSans is not installed on the device.
   Self-hosted (next/font/local) to avoid the Turbopack Google-font bug. */
const figtree = localFont({
  src: [{ path: "../public/fonts/Figtree-Variable.woff2", weight: "400 800" }],
  variable: "--font-sans-loaded",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteConfig.tagline
      ? `${siteConfig.name} - ${siteConfig.tagline}`
      : siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "banking",
    "finance",
    "digital bank",
    "premium banking",
    "modern bank",
  ],
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  icons: {
    icon: "/images/logo.png",
    shortcut: "/images/logo.png",
    apple: "/images/logo.png",
  },
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: siteConfig.name,
    title: `${siteConfig.name} - ${siteConfig.tagline}`,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} - ${siteConfig.tagline}`,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#efedec" },
    { media: "(prefers-color-scheme: dark)", color: "#16052b" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={figtree.variable}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("zenus-theme");var d=t==="dark";document.documentElement.classList.toggle("dark",d);}catch(e){document.documentElement.classList.remove("dark");}})();`,
          }}
        />
        {/* Zoho SalesIQ chat widget */}
        <script
          dangerouslySetInnerHTML={{
            __html: `window.$zoho=window.$zoho || {};$zoho.salesiq=$zoho.salesiq||{ready:function(){}}`,
          }}
        />
        <script
          id="zsiqscript"
          src="https://salesiq.zohopublic.com/widget?wc=siq3fe391e9c0887c94e2b76f581c4388c1a798c3bf2879214ea8784e2b726c3d93"
          defer
        />
      </head>
      <body className="min-h-screen antialiased">
        <AuthProvider />
        <LanguageProvider />
        {children}
      </body>
    </html>
  );
}
