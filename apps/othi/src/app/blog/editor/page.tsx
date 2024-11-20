"use client";

import { EditorProvider } from "@othi/components/editor/EditorProvider";
import { useEffect } from "react";
import { useSetAtom } from "jotai";
import {
  editorTempBlogIdAtom,
  generateEditorTempBlogIdAtom,
} from "@othi/components/editor/store";
import { RESET } from "jotai/utils";
import Link from "next/link";
import { MoveLeft } from "lucide-react";
import { BlogFormProvider } from "../[id]/_provider/BlogFormProvider";
import { EditorSubmitButton } from "../[id]/_provider/EditorSubmitButton";
import { BlogForm } from "../[id]/_provider/BlogForm";

export default function Page() {
  const createTempBlogId = useSetAtom(generateEditorTempBlogIdAtom);
  const reset = useSetAtom(editorTempBlogIdAtom);

  // generates a new id on render
  useEffect(() => {
    createTempBlogId();
    return () => {
      reset(RESET);
    };
  }, [createTempBlogId, reset]);

  return (
    <BlogFormProvider>
      <div className="flex flex-col gap-2">
        <Link
          className="text-muted-foreground flex items-center gap-2 hover:underline"
          href="/blog"
        >
          <MoveLeft className="h-4 w-4" />
          Blog
        </Link>
        <BlogForm />

        <EditorProvider>
          <EditorSubmitButton mode="create" />
        </EditorProvider>
      </div>
    </BlogFormProvider>
  );
}
