"use client";

import { useAtom } from "jotai";
import { useCallback } from "react";
import { isScrolledAtom } from "./store";

export function useViewportInfo(TOP_SCROLL_HEIGHT = 40) {
  const [isScrolled, setIsScrolled] = useAtom(isScrolledAtom);
  const scrollEvent = useCallback(
    (_e: Event) => {
      if (window.scrollY > TOP_SCROLL_HEIGHT) {
        // avoid unnecessary true re-assigning
        if (!isScrolled) setIsScrolled(true);
      } else setIsScrolled(false);
    },
    [TOP_SCROLL_HEIGHT, setIsScrolled, isScrolled],
  );

  function scrollFn() {
    if (typeof window !== "undefined")
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
  }

  return { isScrolled, setIsScrolled, scrollEvent, scrollFn };
}
