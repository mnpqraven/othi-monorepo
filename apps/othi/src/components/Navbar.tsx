"use client";

import { headerRoute } from "@othi/lib/constants";
import Link from "next/link";

export function Navbar() {
  // NOTE: default pt is height of expanded navbar
  // shrink navbar doesn't have any change in pt height
  return (
    <div className="sticky top-0 flex h-8 gap-2">
      {headerRoute.map((route) => (
        <Link href={route.path} key={route.path}>
          {route.label}
        </Link>
      ))}
    </div>
  );
}
