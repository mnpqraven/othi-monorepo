import { Home } from "lucide-react";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export interface NavbarItem {
  label?: string;
  path: string;
  icon?: ReactNode;
}

export const routes: NavbarItem[] = [
  { label: "Home", path: "/", icon: <Home /> },
];

export function usePathCompare() {
  const pathname = usePathname();
  function isSamePath(path: string) {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  }
  return { isSamePath };
}
