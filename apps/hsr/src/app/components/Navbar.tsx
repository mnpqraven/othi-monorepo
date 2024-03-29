"use client";

import Link from "next/link";
import type { HTMLAttributes } from "react";
import {
  Github,
  LineChart,
  Ticket,
  UserSquare,
  GalleryHorizontalEnd,
  BookCopy,
} from "lucide-react";
import { usePathname } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "ui/primitive";
import { cn } from "lib";
import { ThemeToggle } from "ui/shared/ThemeToggle";
import { CommandCenter } from "./CommandCenter";

const menu = [
  {
    path: "/jade-estimate",
    label: "Stellar Jade Tracker",
    icon: <Ticket className="h-4 w-4" />,
    keybind: "q",
  },
  {
    path: "/gacha-graph",
    label: "Gacha Estimation",
    icon: <LineChart className="h-4 w-4" />,
    keybind: "w",
  },
  {
    path: "/character-db",
    label: "Character DB",
    icon: <UserSquare className="h-4 w-4" />,
    keybind: "e",
  },
  {
    path: "/lightcone-db",
    label: "Light Cone DB",
    icon: <GalleryHorizontalEnd className="h-4 w-4" />,
    keybind: "r",
  },
  {
    path: "/card",
    label: "Character Card",
    icon: <BookCopy className="h-4 w-4" />,
    keybind: "c",
  },
];
function Navbar({ className, ...props }: HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();

  const defaultLinkClass =
    "hover:text-primary flex items-center space-x-1 text-sm font-medium transition-colors";
  const pathnameClass = (path: string) =>
    cn(
      defaultLinkClass,
      !pathname.startsWith(path) ? "text-muted-foreground" : "",
    );

  return (
    <div className="bg-background sticky top-0 z-50 flex h-12 items-center border-b px-4">
      <nav
        className={cn(
          "mr-auto flex flex-1 items-center space-x-4 lg:space-x-6",
          className,
        )}
        {...props}
      >
        <TooltipProvider delayDuration={0}>
          {menu.map(({ path, label, icon }) => (
            <Link href={path} key={path}>
              <Tooltip>
                <TooltipTrigger className={pathnameClass(path)}>
                  {icon} <span className="hidden xl:inline-block">{label}</span>
                </TooltipTrigger>
                <TooltipContent className="xl:hidden">{label}</TooltipContent>
              </Tooltip>
            </Link>
          ))}
        </TooltipProvider>
      </nav>

      <div className="flex items-center justify-end space-x-4 lg:space-x-6">
        <CommandCenter routes={menu} />

        <a
          className={cn(defaultLinkClass, "text-muted-foreground ml-auto")}
          href="https://github.com/mnpqraven/gacha-planner"
          rel="noopener"
          target="_blank"
        >
          <Github />
        </a>
        <ThemeToggle />
      </div>
    </div>
  );
}
export default Navbar;
