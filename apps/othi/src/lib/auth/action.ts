/* eslint-disable @typescript-eslint/require-await */
"use server";

import { cookies } from "next/headers";
import type { Account } from "next-auth";
import { COOKIES_KEY } from "lib/constants";

export async function serverSignOut() {
  cookies().delete(COOKIES_KEY.github);
}

export async function serverSignIn(account: Account) {
  cookies().set({
    name: COOKIES_KEY.github,
    value: JSON.stringify(account),
  });
}
