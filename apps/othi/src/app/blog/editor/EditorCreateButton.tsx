"use client";

import { useCurrentEditor } from "@tiptap/react";
import { Button } from "ui/primitive";
import { trpc } from "protocol";
import { useAtomValue } from "jotai";
import { editorTempBlogIdAtom } from "@othi/components/editor/EditorProvider";

export function EditorCreateButton() {
  const { editor } = useCurrentEditor();
  const tempBlogId = useAtomValue(editorTempBlogIdAtom);
  const { mutate: upload } = trpc.utils.blog.uploadMarkdown.useMutation();
  const { mutate } = trpc.utils.blog.convertToMD.useMutation({
    onSuccess(markdownString) {
      upload({ markdownString, tempBlogId });
    },
  });

  function onCreate() {
    if (editor) {
      mutate({ htmlString: editor.getHTML() });
    }
  }

  return !editor ? null : (
    <Button disabled={editor.isEmpty} onClick={onCreate}>
      Create
    </Button>
  );
}
