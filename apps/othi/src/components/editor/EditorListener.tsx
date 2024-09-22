"use client";

import { commandOpenAtom } from "@othi/lib/store";
import { useCurrentEditor } from "@tiptap/react";
import { useAtomValue } from "jotai";
import { useEffect } from "react";

/**
 * This component handles listening and updates misc. states
 *
 * For now it does the following
 * - refocus on closing the command center
 */
export function EditorListener() {
  const open = useAtomValue(commandOpenAtom);
  const { editor } = useCurrentEditor();

  useEffect(() => {
    if (editor && !open) {
      editor.commands.focus();
    }
  }, [editor, open]);
  return null;
}
