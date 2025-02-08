import type { Params } from "lib/generics";
import { trpcServer } from "protocol/trpc/react/server";
import { EditorProvider } from "@othi/components/editor/EditorProvider";
import Link from "next/link";
import { Info, MoveLeft } from "lucide-react";
import { redirect } from "next/navigation";
import { isSuperAdmin } from "auth";
import { getServerSession } from "next-auth";
import { BlogFormProvider } from "../_provider/BlogFormProvider";
import { BlogForm } from "../_provider/BlogForm";
import { EditorSubmitButton } from "../_provider/EditorSubmitButton";

export default async function Page({ params }: Params) {
  const isSudo = await isSuperAdmin({
    sessionFn: getServerSession,
  });
  if (!isSudo) return redirect("/blog");

  const id = params?.id as string;
  const data = await trpcServer.blog.byId({ id, tags: true });

  if (!data) return "not found";

  const { meta, contentHtml } = data;

  // flatten the tags, we don't need the labels
  const tags = "tags" in meta ? meta.tags.map((e) => e.code) : undefined;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <Link
          className="text-muted-foreground flex items-center gap-2 hover:underline"
          href="/blog"
        >
          <MoveLeft className="h-4 w-4" />
          Blog
        </Link>
        <span className="inline-flex gap-1 text-sm text-muted-foreground items-center">
          <Info className="h-4 w-4" />
          Open help menu with Ctrl + /
        </span>
      </div>

      <BlogFormProvider defaultValue={{ ...meta, tags }} id={id} mode="update">
        <BlogForm />

        <EditorProvider content={contentHtml}>
          <EditorSubmitButton mode="update" />
        </EditorProvider>
      </BlogFormProvider>
    </div>
  );
}
