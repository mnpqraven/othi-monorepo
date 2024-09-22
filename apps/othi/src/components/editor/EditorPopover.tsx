import { BubbleMenu, useCurrentEditor } from "@tiptap/react";
import { EditorBold, EditorItalic, EditorStrike, EditorUnderline } from "./modifiers";

export function EditorPopover() {
  const { editor } = useCurrentEditor();

  if (!editor) return null;

  return (
    <BubbleMenu
      className="flex gap-1 rounded-md bg-background border p-1"
      editor={editor}
      tippyOptions={{ duration: 100 }}
    >
      <EditorBold />
      <EditorItalic />
      <EditorUnderline />
      <EditorStrike />
    </BubbleMenu>
  );
}
