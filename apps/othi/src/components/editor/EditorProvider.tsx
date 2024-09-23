/* eslint-disable import/no-named-as-default */
"use client";

import type { ComponentProps, ReactNode } from "react";
import type { Extensions } from "@tiptap/react";
import { EditorProvider as PrimitiveProvider } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import FileHandler from "@tiptap-pro/extension-file-handler";
import Link from "@tiptap/extension-link";
import { cva } from "class-variance-authority";
import { useToast } from "ui/primitive";
import { EditorMenubar } from "./EditorMenubar";
import { EditorListener } from "./EditorListener";
import { EditorPopover } from "./EditorPopover";

function useExtensions() {
  const { toast } = useToast();

  const extensions: Extensions = [
    StarterKit,
    Underline,
    Link.configure({
      autolink: true,
      openOnClick: false,
      defaultProtocol: "https",
    }),
    TextAlign,
    Subscript,
    Superscript,
    Image,
    FileHandler.configure({
      allowedMimeTypes: ["image/png", "image/jpeg", "image/gif", "image/webp"],
      onDrop: (currentEditor, files, pos) => {
        toast({
          title: "onDrop",
          description: "onDrop",
        });

        files.forEach((file) => {
          const fileReader = new FileReader();

          fileReader.readAsDataURL(file);
          fileReader.onload = () => {
            currentEditor
              .chain()
              .insertContentAt(pos, {
                type: "image",
                attrs: {
                  src: fileReader.result,
                },
              })
              .focus()
              .run();
          };
        });
      },
      onPaste: (currentEditor, files, htmlContent) => {
        toast({
          title: "onPaste",
          description: "onPaste",
        });
        // TODO: uploadthing temp upload

        files.forEach((file) => {
          if (htmlContent) {
            // if there is htmlContent, stop manual insertion & let other extensions handle insertion via inputRule
            // you could extract the pasted file from this url string and upload it to a server for example
            console.log(htmlContent); // eslint-disable-line no-console
            return false;
          }

          const fileReader = new FileReader();

          fileReader.readAsDataURL(file);
          fileReader.onload = () => {
            currentEditor
              .chain()
              .insertContentAt(currentEditor.state.selection.anchor, {
                type: "image",
                attrs: {
                  src: fileReader.result,
                },
              })
              .focus()
              .run();
          };
        });
      },
    }),
  ];
  return { extensions };
}

export function EditorProvider({
  children,
  content,
}: {
  children: ReactNode;
  content?: ComponentProps<typeof PrimitiveProvider>["content"];
}) {
  // from textarea
  const editorStyle = cva(
    "border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring min-h-[80px] w-full rounded-md border px-4 py-4 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  );
  const { extensions } = useExtensions();
  return (
    <PrimitiveProvider
      content={content}
      editorProps={{
        attributes: {
          class: editorStyle(),
        },
      }}
      extensions={extensions}
      immediatelyRender={false}
      slotBefore={<EditorMenubar />}
    >
      <EditorPopover />
      <EditorListener />

      {children}
    </PrimitiveProvider>
  );
}
