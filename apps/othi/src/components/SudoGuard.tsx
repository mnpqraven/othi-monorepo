import { cookies } from "next/headers";
import { getGithubUser, isSuperAdmin } from "protocol/trpc/utils/github";
import type { ReactNode } from "react";

interface Prop {
  children: ReactNode;
  level?: "authed" | "sudo";
}

export async function SudoGuard({ children }: Prop) {
  const isSudo = await getGithubUser(cookies).then((e) =>
    isSuperAdmin(e?.ghUser),
  );

  if (!isSudo) return null;

  return <>{children}</>;
}
