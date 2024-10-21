"use client";

import { EditorProvider } from "@othi/components/editor/EditorProvider";
import type { Blog } from "database/schema";
import { BlogFormProvider, useBlogForm } from "../../editor/BlogFormProvider";
import { EditorUpdateButton } from "./EditorUpdateButton";

interface Prop {
  content: string;
  defaultValue?: Blog;
  blogId: string;
}
export function ClientContainer({ content, defaultValue, blogId }: Prop) {
  const { form } = useBlogForm(defaultValue);

  return (
    <BlogFormProvider form={form}>
      <EditorProvider content={content}>
        <EditorUpdateButton blogId={blogId} form={form} />
      </EditorProvider>
    </BlogFormProvider>
  );
}
