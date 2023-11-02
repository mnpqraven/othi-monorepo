import { Home, Newspaper } from "lucide-react";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

export interface NavbarItem {
  label?: string;
  path: string;
  icon?: ReactNode;
}

export const routes: NavbarItem[] = [
  { label: "Home", path: "/", icon: <Home /> },
  { label: "About", path: "/about", icon: <Home /> },
  { label: "Blog", path: "/blog", icon: <Newspaper /> },
];

export function usePathCompare() {
  const pathname = usePathname();
  function isSamePath(path: string) {
    if (path == "/") return pathname == "/";
    return pathname.startsWith(path);
  }
  return { isSamePath };
}
