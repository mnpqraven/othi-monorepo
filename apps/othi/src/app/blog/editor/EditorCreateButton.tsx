"use client";

import { useCurrentEditor } from "@tiptap/react";
import { Button } from "ui/primitive";

export function EditorCreateButton() {
  const { editor } = useCurrentEditor();

  function onCreate() {
    if (editor) {
      const data = editor.getHTML();
      // eslint-disable-next-line no-console
      console.log(data);
    }
  }

  return !editor ? null : (
    <Button disabled={editor.isEmpty} onClick={onCreate}>
      Create
    </Button>
  );
}
