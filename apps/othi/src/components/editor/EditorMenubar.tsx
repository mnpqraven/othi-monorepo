import { useCurrentEditor } from "@tiptap/react";
import {
  EditorBold,
  EditorCode,
  EditorHeadingGroup,
  EditorItalic,
  EditorLink,
  EditorUnderline,
} from "./modifiers";

export function EditorMenubar() {
  const { editor } = useCurrentEditor();
  if (!editor) return null;

  return (
    <div className="flex gap-2">
      <EditorBold />
      <EditorItalic />
      <EditorUnderline />
      <EditorCode />
      <EditorLink />
      <EditorHeadingGroup />
    </div>
  );
}
