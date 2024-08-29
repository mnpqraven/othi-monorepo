import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { COOKIES_KEY } from "lib/constants";
import { type Account } from "next-auth";
import type { RequestCookies } from "next/dist/compiled/@edge-runtime/cookies";
import { env } from "../../env";

interface GithubUser {
  id: number;
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

export async function getGithubUser2(
  cookieFn: (() => ReadonlyRequestCookies) | RequestCookies,
): Promise<{ ghUser: GithubUser; account: Account } | undefined> {
  try {
    const ghstr =
      typeof cookieFn === "function"
        ? cookieFn().get(COOKIES_KEY.github)?.value
        : cookieFn.get(COOKIES_KEY.github)?.value;

    if (ghstr) {
      const ghAccount = JSON.parse(ghstr) as unknown as Account;
      const { access_token: accessToken } = ghAccount;
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
      return { ghUser: jsoned, account: ghAccount };
    }
    return undefined;
  } catch {
    return undefined;
  }
}

export function isSuperAdmin(user?: GithubUser): boolean {
  if (!user) return false;

  // id is public data but this is a safe assert
  return user.id === env.GITHUB_IDENT;
}
