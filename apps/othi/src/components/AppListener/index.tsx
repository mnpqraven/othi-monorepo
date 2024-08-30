"use client";

import { useCallback, useEffect, type ReactNode } from "react";
import { useSetAtom } from "jotai";
import { commandOpenAtom } from "@othi/lib/store";
import { useViewportInfo } from "./hook";

const TOP_SCROLL_HEIGHT = 40;

export function AppListener({ children }: { children: ReactNode }) {
  const { isScrolled, _setIsScrolled } = useViewportInfo();
  const setCommandOpen = useSetAtom(commandOpenAtom);

  const scrollFn = useCallback(
    (_e: Event) => {
      if (window.scrollY > TOP_SCROLL_HEIGHT) {
        // avoid unnecessary true re-assigning
        if (!isScrolled) _setIsScrolled(true);
      } else _setIsScrolled(false);
    },
    [_setIsScrolled, isScrolled],
  );

  const commandCenterFn = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandOpen((open) => !open);
      }
    },
    [setCommandOpen],
  );

  const cleanup = useCallback(() => {
    window.removeEventListener("scroll", scrollFn);
    window.removeEventListener("keydown", commandCenterFn);
  }, [commandCenterFn, scrollFn]);

  useEffect(() => {
    window.addEventListener("scroll", scrollFn, { passive: true });
    window.addEventListener("keydown", commandCenterFn);

    return cleanup;
  }, [cleanup, commandCenterFn, scrollFn]);

  return children;
}
