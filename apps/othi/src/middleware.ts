import { withAuth } from "next-auth/middleware";
import type { NextRequestWithAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { isSuperAdmin } from "auth";

async function middleware(req: NextRequestWithAuth) {
  const { nextauth, url } = req;
  const isSudo = await isSuperAdmin({ nextauth });
  if (isSudo) NextResponse.next();
  else return NextResponse.redirect(new URL("/whoami", url));
}

export default withAuth(middleware);

export const config = {
  matcher: ["/:path*/create", "/sudo/:path*"],
};
