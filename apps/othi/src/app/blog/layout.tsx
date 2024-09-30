import type { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="w-2/3 self-center">
      {children}
    </div>
  );
}
