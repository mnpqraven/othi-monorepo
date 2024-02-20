"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { cn } from "lib/utils";
import { ThemeToggle } from "ui/shared/ThemeToggle";
import { routes, usePathCompare } from "./routes";

export function Navbar() {
  const { status } = useSession();
  const { isSamePath } = usePathCompare();
  const defaultLinkClass =
    "flex items-center gap-1 space-x-1 text-sm font-medium transition-colors hover:text-primary";

  const pathnameClass = (path: string) =>
    cn(defaultLinkClass, isSamePath(path) ? "" : "text-muted-foreground");

  return (
    <div className="sticky top-0 z-50 flex h-12 items-center justify-between border-b bg-background px-4">
      <div className="flex items-center gap-2">
        {routes
          .filter((_) => !isSamePath("/login"))
          .map(({ icon, label, path }) => (
            <Link className={pathnameClass(path)} href={path} key={path}>
              {icon}
              {label}
            </Link>
          ))}
      </div>

      <div className="flex items-center gap-1">
        <ThemeToggle />
        {status === "authenticated" && (
          <button onClick={() => void signOut()} type="button">
            Sign out
          </button>
        )}
        {status === "unauthenticated" && (
          <button onClick={() => void signIn()} type="button">
            Sign in
          </button>
        )}
      </div>
    </div>
  );
}
