"use client";

import { useCallback, useEffect, type ReactNode } from "react";
import { useSetCommandReducer } from "@othi/lib/store";
import { useViewportInfo } from "./hook";

export function AppListener({ children }: { children: ReactNode }) {
  const { scrollEvent } = useViewportInfo();
  const setCommand = useSetCommandReducer();

  const commandCenterFn = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommand({ type: "toggleOpen", payload: undefined });
      }
    },
    [setCommand],
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
