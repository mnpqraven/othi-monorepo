import { isSuperAdmin } from "auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

export default async function Layout({ children }: { children: ReactNode }) {
  const isSudo = await isSuperAdmin({
    sessionFn: getServerSession,
  });
  if (!isSudo) return redirect("/blog");
  return children;
}
