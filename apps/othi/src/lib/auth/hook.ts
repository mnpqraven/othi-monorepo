"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export function useLogin() {
  const { status, data } = useSession();
  function signInGithub() {
    void signIn("github");
  }

  function clientSignOut() {
    void signOut();
  }

  return { signOut: clientSignOut, signIn: signInGithub, status, data };
}
