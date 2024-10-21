import type { Params } from "lib/generics";
import { trpcServer } from "protocol/trpc/react/server";
import { ClientContainer } from "./ClientContainer";

export default async function Page({ params }: Params) {
  const id = params?.id as string;
  const data = await trpcServer.blog.byId({ id });

  if (!data) return "not found";

  const { meta, contentHtml } = data;

  return <ClientContainer blogId={id} content={contentHtml} defaultValue={meta} />;
}
