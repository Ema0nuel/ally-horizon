"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, User, Building2, ShieldCheck, ShieldX } from "lucide-react";

import { formatCurrency, formatDateTime } from "@/lib/format";
import { fetchAdminUsers, type AdminUser } from "@/lib/admin/data";
import { UserAvatar } from "@/components/admin/user-avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const data = await fetchAdminUsers();
        if (active) setUsers(data);
      } catch (error) {
        console.error("Failed to load users:", error);
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, []);

  const filtered = users.filter(
    (u) =>
      u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.account?.account_number?.includes(search.trim())
  );

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm font-semibold text-muted-foreground">Admin Panel / Users</p>
        <h1 className="mt-1 font-heading text-3xl font-bold tracking-tight text-foreground">
          User Management
        </h1>
      </header>

      <Card>
        <CardContent className="pt-0">
          <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or account number..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
                type="search"
              />
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>
                {filtered.length} of {users.length} users
              </span>
            </div>
          </div>

          {loading ? (
            <div className="space-y-3 p-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-3">
                  <div className="skeleton size-9 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="skeleton h-4 w-3/4" />
                    <div className="skeleton h-3 w-1/2" />
                  </div>
                  <div className="skeleton h-8 w-20 rounded-full" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-12 text-center">
              <User className="mx-auto size-12 text-muted-foreground/50" />
              <p className="mt-4 text-muted-foreground">No users found</p>
              {search && (
                <Button variant="ghost" className="mt-2" onClick={() => setSearch("")}>
                  Clear search
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="px-4 py-3 text-left font-semibold text-muted-foreground">User</th>
                    <th className="hidden px-4 py-3 text-left font-semibold text-muted-foreground md:table-cell">
                      Email
                    </th>
                    <th className="hidden px-4 py-3 text-left font-semibold text-muted-foreground lg:table-cell">
                      Account
                    </th>
                    <th className="px-4 py-3 text-right font-semibold text-muted-foreground">Balance</th>
                    <th className="hidden px-4 py-3 text-center font-semibold text-muted-foreground sm:table-cell">
                      Status
                    </th>
                    <th className="hidden whitespace-nowrap px-4 py-3 text-left font-semibold text-muted-foreground lg:table-cell">
                      Joined
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((user) => {
                    const active = user.account?.is_active !== false;
                    return (
                      <tr
                        key={user.id}
                        className="cursor-pointer transition-colors hover:bg-muted/50"
                        onClick={() => router.push(`/admin/users/${user.id}`)}
                        title={`View ${user.full_name || user.email || "user"}`}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <UserAvatar name={user.full_name} email={user.email} src={user.avatar_url} className="size-9" />
                            <div className="min-w-0">
                              <p className="truncate font-semibold text-foreground">
                                {user.full_name || "Unnamed User"}
                              </p>
                              <p className="font-mono text-xs text-muted-foreground">
                                {user.id.slice(0, 8)}…
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="hidden max-w-xs px-4 py-3 md:table-cell">
                          <p className="truncate font-mono text-xs text-muted-foreground">
                            {user.email || "—"}
                          </p>
                        </td>
                        <td className="hidden px-4 py-3 lg:table-cell">
                          <Badge variant="secondary" className="gap-1">
                            <Building2 className="size-3" />
                            {user.account?.account_type || "—"}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-sm font-semibold">
                          {formatCurrency(user.total_balance)}
                        </td>
                        <td className="hidden px-4 py-3 text-center sm:table-cell">
                          {active ? (
                            <span className="inline-flex items-center gap-1 text-[var(--primary-deep)]">
                              <ShieldCheck className="size-4" /> Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[var(--primary-deep)]">
                              <ShieldX className="size-4" /> Suspended
                            </span>
                          )}
                        </td>
                        <td className="hidden whitespace-nowrap px-4 py-3 font-mono text-xs text-muted-foreground lg:table-cell">
                          {formatDateTime(user.created_at)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
