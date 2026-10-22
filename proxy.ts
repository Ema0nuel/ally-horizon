import { NextResponse, type NextRequest } from "next/server";

import {
  ADMIN_SESSION_COOKIE,
  verifyAdminSessionToken,
} from "@/lib/admin-session";
import { rateLimit } from "@/lib/rate-limit";
import { updateSession } from "@/lib/supabase/middleware";

const ADMIN_HOSTS = new Set(["admin.allybanks.cc"]);

// Search engines may see the home page and nothing else. Every other crawler,
// scraper, and script tool gets a 404 across the whole site.
const SEARCH_BOTS =
  /googlebot|bingbot|duckduckbot|slurp|yandex|baiduspider|applebot|petalbot|facebookexternalhit|twitterbot|linkedinbot|pinterestbot|telegrambot|whatsapp|slackbot|discordbot|embedly|quora|redditbot|skypeuripreview|vkshare|ia_archiver|archive\.org_bot/i;

const BROWSER_UA = /mozilla\/|chrome\/|safari\/|firefox\/|edg\//i;
const HEADLESS_UA = /headless|puppeteer|playwright|phantomjs|selenium|electron/i;
const AUTOMATION_UA =
  /curl|wget|python|scrapy|httpx|aiohttp|okhttp|java\/|libwww|postman|insomnia|axios|node-fetch|undici|go-http-client|ruby|php\/|bot|crawler|spider|scan|masscan|zgrab|nikto|sqlmap|nikto/i;

const AUTH_PATHS = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify",
  "/auth",
  "/admin/login",
];

function isAllowedHost(hostname: string): boolean {
  if (ADMIN_HOSTS.has(hostname)) return true;
  if (hostname === "localhost" || hostname.startsWith("127.0.0.1")) return true;
  return false;
}

function notFound(): NextResponse {
  return new NextResponse(null, { status: 404 });
}

function tooMany(retryAfterSec: number): NextResponse {
  return new NextResponse(null, {
    status: 429,
    headers: { "Retry-After": String(retryAfterSec) },
  });
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hostname = request.headers.get("host")?.split(":")[0] ?? "";
  const userAgent = request.headers.get("user-agent") ?? "";

  // --- Bot and automation blocking -------------------------------------
  const isSearchBot = SEARCH_BOTS.test(userAgent);
  const isBrowser =
    BROWSER_UA.test(userAgent) && !HEADLESS_UA.test(userAgent);

  if (isSearchBot) {
    // Crawlers only ever see the home page.
    if (pathname !== "/") return notFound();
  } else if (!isBrowser || AUTOMATION_UA.test(userAgent)) {
    return notFound();
  }

  // --- Rate limiting ----------------------------------------------------
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  const isAuthPath =
    AUTH_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`)) ||
    pathname === "/api/captcha" ||
    pathname === "/api/admin/login";
  const isApi = pathname.startsWith("/api/");

  const limit = isAuthPath ? 8 : isApi ? 60 : 240;
  const bucket = isAuthPath ? "auth" : isApi ? "api" : "page";
  const rl = rateLimit(`${bucket}:${ip}`, limit, 60_000);
  if (!rl.ok) return tooMany(rl.retryAfterSec);

  // --- Admin panel: host gate and server-side session -------------------
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    if (!isAllowedHost(hostname)) {
      if (pathname.startsWith("/api/admin")) {
        return NextResponse.json({ error: "Not Found" }, { status: 404 });
      }
      return NextResponse.rewrite(new URL("/admin-blocked", request.url));
    }

    // Bare admin subdomain lands on the panel.
    if (pathname === "/" && ADMIN_HOSTS.has(hostname)) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    const isLoginPage =
      pathname === "/admin/login" || pathname === "/api/admin/login";
    const isLogout = pathname === "/api/admin/logout";

    if (!isLoginPage && !isLogout) {
      const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
      const ok = await verifyAdminSessionToken(token);
      if (!ok) {
        if (pathname.startsWith("/api/admin")) {
          return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        return NextResponse.redirect(new URL("/admin/login", request.url));
      }
    }
  }

  // --- Session refresh and dashboard gate ------------------------------
  const { response, user } = await updateSession(request);

  if (pathname.startsWith("/dashboard") && !user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Only the home page is indexable. Everything else opts out of search.
  if (pathname !== "/") {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?|txt|xml|map)$).*)',
  ],
};
