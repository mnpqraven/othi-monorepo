import { BubbleMenu, useCurrentEditor } from "@tiptap/react";
import {
  EditorBold,
  EditorItalic,
  EditorStrike,
  EditorUnderline,
} from "./modifiers";

export function EditorPopover() {
  const { editor } = useCurrentEditor();

  if (!editor) return null;

  const isImage = editor.isActive("image");

  // TODO: buttons for image

  return (
    <BubbleMenu
      className="bg-background flex gap-1 rounded-md border p-1"
      editor={editor}
      tippyOptions={{ duration: 100 }}
    >
      {isImage ? null : (
        <>
          <EditorBold />
          <EditorItalic />
          <EditorUnderline />
          <EditorStrike />
        </>
      )}
    </BubbleMenu>
  );
}
