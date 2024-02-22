"use client";

import Link from "next/link";
import { cn } from "lib/utils";
import { ThemeToggle } from "ui/shared/ThemeToggle";
import { routes, usePathCompare } from "./routes";

export function Navbar() {
  const { isSamePath } = usePathCompare();
  const defaultLinkClass =
    "hover:text-primary flex items-center gap-1 space-x-1 text-sm font-medium transition-colors";

  const pathnameClass = (path: string) =>
    cn(defaultLinkClass, isSamePath(path) ? "" : "text-muted-foreground");

  return (
    <div className="bg-background sticky top-0 z-50 flex h-12 items-center justify-between border-b px-4">
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
      </div>
    </div>
  );
}
