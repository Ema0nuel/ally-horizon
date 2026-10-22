import type { Metadata } from "next";

import { Hero } from "@/components/home/hero";
import { TrustBar } from "@/components/home/trust-bar";
import { ProductsTabs } from "@/components/home/products-tabs";
import { FeatureHighlight } from "@/components/home/feature-highlight";
import { Testimonials } from "@/components/home/testimonials";
import { BlogNews } from "@/components/home/blog-news";
import { buildMetadata, siteConfig } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Ally — Premium Banking Reimagined",
  description: siteConfig.description,
  absolute: true,
});

export default function Home() {
  return (
    <>
      <Hero />
      <TrustBar />
      <ProductsTabs />
      <FeatureHighlight />
      <Testimonials />
      <BlogNews />
    </>
  );
}
