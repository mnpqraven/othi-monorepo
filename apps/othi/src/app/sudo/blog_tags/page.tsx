import { BlogTagTable } from "./BlogTagTable";
import { BlogTagForm } from "./BlogTagForm";

export default async function Page() {
  return (
    <div className="flex flex-col gap-2">
      <BlogTagForm />

      <BlogTagTable />
    </div>
  );
}
