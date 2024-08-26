import { withAuth } from "next-auth/middleware";
import type { NextRequestWithAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { getGithubUser, isSuperAdmin } from "protocol/trpc/utils/github";

async function middleware(req: NextRequestWithAuth) {
  const data = await getGithubUser(req.cookies);
  const isSudo = isSuperAdmin(data?.ghUser);

  if (isSudo) NextResponse.next();
  else {
    return NextResponse.redirect(new URL("/", req.url));
  }
}

export default withAuth(middleware);

export const config = {
  matcher: ["/:path*/create", "/sudo/:path*"],
};
