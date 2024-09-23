"use client";

import { useCurrentEditor } from "@tiptap/react";
import { Button } from "ui/primitive";
import { trpc } from "protocol";

export function EditorCreateButton() {
  const { editor } = useCurrentEditor();
  const { mutate: upload } = trpc.utils.blog.uploadMarkdown.useMutation();
  const { mutate } = trpc.utils.blog.convertToMD.useMutation({
    onSuccess(data) {
      console.log(data);
      upload({ markdownString: data });
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
