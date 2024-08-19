import { env } from "../../env";

interface GithubUser {
  id: number;
}
export async function getGithubUser(
  accessToken?: string,
): Promise<GithubUser | undefined> {
  try {
    const res = await fetch("https://api.github.com/user", {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "force-cache",
      // seconds
      next: { revalidate: 3600 },
    });
    const jsoned = (await res.json()) as GithubUser;
    return jsoned;
  } catch {
    return undefined;
  }
}

export async function isSuperAdmin(accessToken?: string): Promise<boolean> {
  if (!accessToken) return false;

  try {
    const user = await getGithubUser(accessToken);
    // id is public data but this is a safe assert
    return user?.id === env.GITHUB_IDENT;
  } catch (error) {
    return false;
  }
}
