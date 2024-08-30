import { getServerSession } from "next-auth";
import { isSuperAdmin } from "auth";
import type { ReactNode } from "react";

interface Prop {
  children: ReactNode;
  level?: "authed" | "sudo";
}
export async function SudoGuard({ children }: Prop) {
  const isSudo = await isSuperAdmin({
    sessionFn: getServerSession,
  });

  if (!isSudo) return null;

  return <>{children}</>;
}
