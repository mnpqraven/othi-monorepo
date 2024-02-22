import { Gamepad2, Home } from "lucide-react";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export interface NavbarItem {
  label?: string;
  path: string;
  icon?: ReactNode;
}

export const routes: NavbarItem[] = [
  { label: "Home", path: "/", icon: <Home /> },
  { label: "Games", path: "/games", icon: <Gamepad2 /> },
];

export function usePathCompare() {
  const pathname = usePathname();
  function isSamePath(path: string) {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  }
  return { isSamePath };
}
