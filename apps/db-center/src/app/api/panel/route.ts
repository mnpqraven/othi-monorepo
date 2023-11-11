import { env } from "@db-center/env";
import { appRouter } from "protocol/trpc";
import { renderTrpcPanel } from "trpc-panel";

// eslint-disable-next-line @typescript-eslint/require-await
async function handler() {
  // eslint-disable-next-line turbo/no-undeclared-env-vars
  if (process.env.NODE_ENV === "production")
    return new Response(undefined, { status: 404 });

  return new Response(
    renderTrpcPanel(appRouter, {
      url: `${env.NEXT_PUBLIC_HOST_DB_CENTER}/api`,
    }),
    {
      headers: { "Content-Type": "text/html" },
    }
  );
}

export { handler as POST, handler as GET };
