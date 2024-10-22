"use client";

import { cn } from "lib";
import { usePathname } from "next/navigation";
import type { HTMLAttributes } from "react";
import { forwardRef, useEffect, useState } from "react";

const HEADER_HEIGHT = 64; // in px

export const Navbar = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(function Navbar({ className, ...props }, ref) {
  // NOTE: default pt is height of expanded navbar
  // shrink navbar doesn't have any change in pt height
  const isScrolled = useScrolled();
  const path = usePathname();
  const truncatedPath = `/${path.split("/").at(1) ?? ""}`;

  return (
    <div
      className={cn(
        "sticky top-0 flex gap-2 duration-1000 bg-slate-700 pl-4 items-center",
        isScrolled ? "opacity-50" : "opacity-100",
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

function useScrolled() {
  const [isScrolled, setScrolled] = useState(false);

  const handleScroll = () => {
    setScrolled(window.scrollY > HEADER_HEIGHT);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return isScrolled;
}
