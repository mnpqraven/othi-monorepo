"use client";

import { commandOpenAtom } from "@othi/lib/store";
import { useCurrentEditor } from "@tiptap/react";
import { useAtom, useAtomValue } from "jotai";
import { useEffect } from "react";
import { editorHelpDialogOpen } from "./store";

/**
 * This component handles listening and updates misc. states
 *
 * For now it does the following
 * - refocus on closing the command center
 *
 * Keyboard triggers:
 * - opens help menu with ctlr + /
 */
export function EditorListener() {
  const open = useAtomValue(commandOpenAtom);
  const { editor } = useCurrentEditor();

  // KEYBOARD TRAPPING
  useTrapHelpDialog();

  useEffect(() => {
    if (editor && !open) {
      editor.commands.focus();
    }
  }, [editor, open]);
  return null;
}

function useTrapHelpDialog() {
  const [open, setOpen] = useAtom(editorHelpDialogOpen);
  const { editor } = useCurrentEditor();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "/" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => {
      document.removeEventListener("keydown", down);
    };
  }, [setOpen]);

  useEffect(() => {
    if (editor && !open) {
      editor.commands.focus();
    }
  }, [editor, open]);

  return null;
}
