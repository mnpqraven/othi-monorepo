"use client";

import { useCallback, useEffect, type ReactNode } from "react";
import { useViewportInfo } from "./hook";

const TOP_SCROLL_HEIGHT = 40;

export function AppListener({ children }: { children: ReactNode }) {
  const { isScrolled, _setIsScrolled } = useViewportInfo();
  const scrollFn = useCallback(
    (_e: Event) => {
      if (window.scrollY > TOP_SCROLL_HEIGHT) {
        // avoid unnecessary true re-assigning
        if (!isScrolled) _setIsScrolled(true);
      } else _setIsScrolled(false);
    },
    [_setIsScrolled, isScrolled],
  );

  const cleanup = useCallback(() => {
    window.removeEventListener("scroll", scrollFn);
  }, [scrollFn]);

  useEffect(() => {
    window.addEventListener("scroll", scrollFn, { passive: true });

    return cleanup;
  }, [cleanup, scrollFn]);

  return children;
}
