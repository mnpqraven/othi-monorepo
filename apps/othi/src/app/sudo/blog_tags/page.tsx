import { trpcServer } from "protocol/trpc/react/server";

export default async function Page() {
  const data = await trpcServer.othi.blogTag.list();
  return (
    <div>
      tag list
      <div>{JSON.stringify(data)}</div>
    </div>
  );
}
