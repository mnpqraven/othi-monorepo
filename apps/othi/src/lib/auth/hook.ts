"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { serverSignOut } from "./action";

export function useLogin() {
  const { status, data } = useSession();
  function signInGithub() {
    void signIn("github");
  }

  function clientSignOut() {
    void signOut();
    void serverSignOut();
  }

  return { signOut: clientSignOut, signIn: signInGithub, status, data };
}
