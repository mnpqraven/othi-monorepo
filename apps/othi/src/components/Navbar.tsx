"use client";

import { headerRoute } from "@othi/lib/constants";
import Link from "next/link";

export function Navbar() {
  // NOTE: default pt is height of expanded navbar
  // shrink navbar doesn't have any change in pt height
  return (
    <div className="flex gap-2 sticky top-0">
      {headerRoute.map((route) => (
        <Link href={route.path} key={route.path}>
          {route.label}
        </Link>
      ))}
    </div>
  );
}
