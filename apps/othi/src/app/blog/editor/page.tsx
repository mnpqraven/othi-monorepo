"use client";

import { EditorProvider } from "@othi/components/editor/EditorProvider";
import { useEffect } from "react";
import { useSetAtom } from "jotai";
import {
  editorTempBlogIdAtom,
  generateEditorTempBlogIdAtom,
} from "@othi/components/editor/store";
import { RESET } from "jotai/utils";
import { EditorCreateButton } from "./EditorCreateButton";
import { BlogFormProvider, useBlogForm } from "./BlogFormProvider";

export default function Page() {
  const { form } = useBlogForm();
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
    <BlogFormProvider form={form}>
      <EditorProvider>
        <EditorCreateButton form={form} />
      </EditorProvider>
    </BlogFormProvider>
  );
}
