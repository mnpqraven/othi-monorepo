"use client";

import { useCurrentEditor } from "@tiptap/react";
import { Button } from "ui/primitive";
import { trpc } from "protocol";
import { useAtomValue } from "jotai";
import { editorTempBlogIdAtom } from "@othi/components/editor/EditorProvider";

export function EditorCreateButton() {
  const { editor } = useCurrentEditor();
  const tempBlogId = useAtomValue(editorTempBlogIdAtom);

  const { mutate: promoteMedia } =
    trpc.utils.blog.upload.promoteTempImage.useMutation();
  const { mutate: uploadMdMeta } =
    trpc.utils.blog.upload.blogMeta.useMutation({
      onSuccess({ data }) {
        if (data)
          promoteMedia({
            blogId: data.id,
            tempBlogId,
          });
      },
    });
  const { mutate: uploadMdBlob } =
    trpc.utils.blog.upload.markdownFile.useMutation({
      onSuccess(uploadedFile) {
        if (uploadedFile) {
          const { name, url } = uploadedFile;
          uploadMdMeta({ name, url });
        }
      },
    });
  const { mutate: convertToMD } = trpc.utils.blog.convertToMD.useMutation({
    onSuccess(markdownString) {
      uploadMdBlob({ markdownString, tempBlogId, title: "testTitle" });
    },
  });

  function onCreate() {
    if (editor) {
      convertToMD({ htmlString: editor.getHTML() });
    }
  }

  return !editor ? null : (
    <Button disabled={editor.isEmpty} onClick={onCreate}>
      Create
    </Button>
  );
}
