"use client";

import { cn } from "lib";
import { usePathname } from "next/navigation";
import type { HTMLAttributes } from "react";
import { forwardRef } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useViewportInfo } from "./AppListener/hook";

const HEADER_HEIGHT = 64; // in px

const adminRoutes = ["/sudo", "/whoami"];

export const Navbar = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(function Navbar({ className, ...props }, ref) {
  const { isScrolled } = useViewportInfo();
  const path = usePathname();
  const truncatedPath = `/${path.split("/").at(1) ?? ""}`;
  const { status } = useSession();

  return (
    <div
      className={cn(
        "sticky top-0 flex gap-2 duration-1000 pl-4 items-center z-50 justify-between",
        isScrolled ? "bg-slate-700/50 backdrop-blur-md" : "bg-slate-700",
        className,
      )}
      ref={ref}
      style={{ height: `${HEADER_HEIGHT}px` }}
      {...props}
    >
      <div className="text-2xl font-bold font-mono flex gap-2">
        <span>{truncatedPath.toUpperCase()}</span>
        {(status === "authenticated" ? adminRoutes : []).map((route) => (
          <Link href={route} key={route}>
            {route.toUpperCase()}
          </Link>
        ))}
      </div>
    </div>
  );
});
