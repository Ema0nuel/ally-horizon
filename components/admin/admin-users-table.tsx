"use client";

import Link from "next/link";
import { User, Search, Filter, ArrowRight } from "lucide-react";

import { formatDateTime } from "@/lib/format";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface AdminUsersTableProps {
  users: Array<{
    id: string;
    email: string;
    full_name: string;
    created_at: string;
    accounts_count: number;
  }>;
  loading: boolean;
}

export function AdminUsersTable({ users, loading }: AdminUsersTableProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg">Recent Users</CardTitle>
        <Link href="/admin/users" className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
          View all
          <ArrowRight className="size-4" />
        </Link>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              className="pl-10"
              type="search"
            />
          </div>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Filter className="size-4" />
            Filter
          </Button>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
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
        ) : users.length === 0 ? (
          <p className="text-center py-8 text-sm text-muted-foreground">No users found</p>
        ) : (
          <div className="rounded-lg border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">User</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground hidden md:table-cell">Email</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground hidden lg:table-cell">Accounts</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Joined</th>
                  <th className="text-right px-4 py-3 font-semibold text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-bold">
                          {user.full_name?.[0] || user.email?.[0] || "U"}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-foreground">
                            {user.full_name || "Unnamed User"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <p className="truncate text-muted-foreground font-mono text-xs">{user.email}</p>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <Badge variant="secondary" className="gap-1">
                        <User className="size-3" />
                        {user.accounts_count}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground font-mono text-xs">
                      {formatDateTime(user.created_at)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/users/${user.id}`}
                        className="text-primary hover:underline text-sm font-semibold"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}