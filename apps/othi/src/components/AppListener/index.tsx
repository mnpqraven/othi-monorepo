"use client";

import { useCallback, useEffect, type ReactNode } from "react";
import { useSetAtom } from "jotai";
import { commandOpenAtom } from "@othi/lib/store";
import { useViewportInfo } from "./hook";

export function AppListener({ children }: { children: ReactNode }) {
  const { scrollEvent } = useViewportInfo();
  const setCommandOpen = useSetAtom(commandOpenAtom);

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
    window.removeEventListener("scroll", scrollEvent);
    window.removeEventListener("keydown", commandCenterFn);
  }, [commandCenterFn, scrollEvent]);

  useEffect(() => {
    // PERF: use passive if we don't need `preventDefault()`
    window.addEventListener("scroll", scrollEvent, { passive: true });
    window.addEventListener("keydown", commandCenterFn);

    return cleanup;
  }, [cleanup, commandCenterFn, scrollEvent]);

  return children;
}
