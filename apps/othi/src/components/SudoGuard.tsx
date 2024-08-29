import { getServerSession } from "next-auth";
import { authOptions } from "protocol/trpc/utils/authOptions";
import { getGithubUser, isSuperAdmin } from "protocol/trpc/utils/github";
import type { ReactNode } from "react";

interface Prop {
  children: ReactNode;
  level?: "authed" | "sudo";
}

export async function SudoGuard({ children }: Prop) {
  const sess = await getServerSession(authOptions);
  // @ts-expect-error during dev
  const isSudo = await getGithubUser(sess?.user?.access_token).then((e) =>
    isSuperAdmin(e?.ghUser),
  );

  if (!isSudo) return null;

  return <>{children}</>;
}
