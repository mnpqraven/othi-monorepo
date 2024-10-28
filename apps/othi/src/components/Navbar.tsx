"use client";

import { cn } from "lib";
import { usePathname } from "next/navigation";
import type { HTMLAttributes } from "react";
import { forwardRef } from "react";
import { useViewportInfo } from "./AppListener/hook";

const HEADER_HEIGHT = 64; // in px

export const Navbar = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(function Navbar({ className, ...props }, ref) {
  const { isScrolled } = useViewportInfo();
  const path = usePathname();
  const truncatedPath = `/${path.split("/").at(1) ?? ""}`;

  return (
    <div
      className={cn(
        "sticky top-0 flex gap-2 duration-1000 pl-4 items-center",
        isScrolled ? "bg-slate-700/50 backdrop-blur-md" : "bg-slate-700",
        className,
      )}
      ref={ref}
      style={{ height: `${HEADER_HEIGHT}px` }}
      {...props}
    >
      <span className="text-2xl font-bold font-mono">
        {truncatedPath.toUpperCase()}
      </span>
    </div>
  );
});
