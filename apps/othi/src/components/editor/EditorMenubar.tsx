import { useCurrentEditor } from "@tiptap/react";
import {
  EditorBlockquote,
  EditorBold,
  EditorBulletList,
  EditorCode,
  EditorHeadingGroup,
  EditorItalic,
  EditorLink,
  EditorOrderedList,
  EditorRedo,
  EditorStrike,
  EditorUnderline,
  EditorUndo,
} from "./modifiers";

export function EditorMenubar() {
  const { editor } = useCurrentEditor();
  if (!editor) return null;

  return (
    <div className="flex gap-2">
      <EditorUndo />
      <EditorRedo />
      <EditorBold />
      <EditorItalic />
      <EditorUnderline />
      <EditorStrike />
      <EditorBulletList />
      <EditorOrderedList />
      <EditorCode />
      <EditorLink />
      <EditorHeadingGroup />
      <EditorBlockquote />
    </div>
  );
}
