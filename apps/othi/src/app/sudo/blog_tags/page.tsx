import { trpcServer } from "protocol/trpc/react/server";
import { BlogTagTable } from "./BlogTagTable";

export default async function Page() {
  const data = await trpcServer.othi.blogTag.list();
  return (
    <div>
      tag list
      <BlogTagTable data={data} />
    </div>
  );
}
