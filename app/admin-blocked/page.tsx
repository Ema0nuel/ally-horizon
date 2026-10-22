import { notFound } from "next/navigation";

// Rewrite target for proxy.ts: /admin URLs opened on a non-admin host
// surface the standard 404 page so the panel looks nonexistent there.
export default function AdminBlockedPage() {
  notFound();
}
