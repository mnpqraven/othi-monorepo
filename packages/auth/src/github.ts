import type { getServerSession } from "next-auth";
import type { NextRequestWithAuth } from "next-auth/middleware";
import { env } from "../env";
import { authOptions } from "./authOptions";

interface GithubUser {
  id: number;
}

interface superAdminParams {
  /**
   * use this if you're in a server context
   */
  sessionFn: typeof getServerSession;
  accessToken: string;
  /**
   * use this if you have `req` access (e.g from middleware)
   */
  nextauth: NextRequestWithAuth["nextauth"];
}
export async function isSuperAdmin({
  sessionFn,
  accessToken,
  nextauth,
}: Partial<superAdminParams>): Promise<boolean> {
  if (nextauth) {
    const gh = await getGithubUser(nextauth.token?.access_token);
    return internalIsSudo(gh?.ghUser);
  }

  if (sessionFn) {
    const session = await sessionFn(authOptions);
    const gh = await getGithubUser(session?.user?.access_token);

    return internalIsSudo(gh?.ghUser);
  }

  if (accessToken) {
    const gh = await getGithubUser(accessToken);
    return internalIsSudo(gh?.ghUser);
  }

  return false;
}

export async function getGithubUser(
  accessToken?: string,
): Promise<{ ghUser: GithubUser } | undefined> {
  if (!accessToken) return undefined;

  try {
    const res = await fetch("https://api.github.com/user", {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      // cache: "force-cache",
      // seconds
      next: { revalidate: 3600 },
    });
    const jsoned = (await res.json()) as GithubUser;
    return { ghUser: jsoned };
  } catch {
    return undefined;
  }
}

export function internalIsSudo(user?: GithubUser): boolean {
  if (!user) return false;

  // id is public data but this is a safe assert
  return user.id === env.GITHUB_IDENT;
}
