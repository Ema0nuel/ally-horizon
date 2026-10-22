import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Reveal } from "./reveal";

const posts = [
  {
    title: "5 Tips for First-Time Home Buyers",
    desc: "Buying your first home? Here are five essential tips to help you get started and avoid common mistakes.",
    date: "July 2025",
    img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
    featured: true,
  },
  {
    title: "How to Refinance and Save",
    desc: "Refinancing your home loan can save you thousands. Learn how to get the best deal and what to watch for.",
    date: "June 2025",
    img: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=600&q=80",
    featured: false,
  },
  {
    title: "Understanding Your Credit Score",
    desc: "Your credit score impacts your loan options. Discover how to improve your score and secure better rates.",
    date: "May 2025",
    img: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&q=80",
    featured: false,
  },
];

function PostCard({
  post,
  index,
}: {
  post: (typeof posts)[number];
  index: number;
}) {
  return (
    <Reveal delay={index * 0.08} className="h-full">
      <Card
        className={cn(
          "card-hover group h-full overflow-hidden",
          post.featured && "lg:row-span-2",
        )}
      >
        <div
          className={cn(
            "relative w-full overflow-hidden",
            post.featured ? "aspect-[16/9]" : "aspect-[16/10]",
          )}
        >
          <Image
            src={post.img}
            alt={post.title}
            fill
            sizes={
              post.featured
                ? "(max-width: 1024px) 100vw, 66vw"
                : "(max-width: 1024px) 100vw, 33vw"
            }
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <CardHeader>
          <CardTitle className="text-lg leading-snug group-hover:text-primary">
            {post.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{post.desc}</p>
          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-primary">{post.date}</span>
            <ArrowUpRight className="size-4 text-muted-foreground transition-colors group-hover:text-primary" />
          </div>
        </CardContent>
      </Card>
    </Reveal>
  );
}

export function BlogNews() {
  return (
    <section id="blog" className="scroll-mt-20 border-t border-border">
      <div className="mx-auto w-full max-w-[1400px] px-6 py-20 md:px-12 md:pt-28 md:pb-16 lg:px-16">
        <Reveal className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <h2 className="text-balance text-3xl tracking-[-0.03em] text-foreground md:text-5xl">
              Latest from our blog.
            </h2>
            <p className="mt-4 text-base text-muted-foreground md:text-lg">
              Insights to help you make smarter money moves.
            </p>
          </div>
          <Link
            href="/community"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
          >
            View all articles
            <ArrowUpRight className="size-4" />
          </Link>
        </Reveal>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:grid-rows-1">
          {posts.map((post, i) => (
            <PostCard key={post.title} post={post} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
