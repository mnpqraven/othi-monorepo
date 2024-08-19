import type { Account } from "next-auth";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { COOKIES_KEY } from "lib/constants";

export function saveGhCookie(
  account: Account,
  cookiefn: () => ReadonlyRequestCookies,
) {
  // TODO: save info into cookie for trpc later
  cookiefn().set({
    name: COOKIES_KEY.github,
    value: JSON.stringify(account),
  });
}
