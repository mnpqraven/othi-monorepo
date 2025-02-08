import { Info, MoveLeft } from "lucide-react";
import Link from "next/link";
import { EditorProvider } from "@othi/components/editor/EditorProvider";
import { BlogFormProvider } from "../[id]/_provider/BlogFormProvider";
import { BlogForm } from "../[id]/_provider/BlogForm";
import { EditorSubmitButton } from "../[id]/_provider/EditorSubmitButton";

export default function Page() {
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

      <BlogFormProvider mode="create">
        <BlogForm />

        <EditorProvider>
          <EditorSubmitButton mode="create" />
        </EditorProvider>
      </BlogFormProvider>
    </div>
  );
}
