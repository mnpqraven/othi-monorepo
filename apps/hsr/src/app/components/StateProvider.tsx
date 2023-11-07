"use client";

import { Provider } from "jotai";
import type { ReactNode } from "react";
import { DevTools } from "jotai-devtools";

interface Prop {
  devTools?: boolean;
  children: ReactNode;
}
export function StateProvider({ children, devTools = false }: Prop) {
  return (
    <Provider>
      {children}
      {devTools ? <DevTools /> : null}
    </Provider>
  );
}
