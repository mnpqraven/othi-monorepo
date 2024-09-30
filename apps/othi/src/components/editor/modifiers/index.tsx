import { useCurrentEditor } from "@tiptap/react";
import {
  Button,
  Form,
  FormField,
  FormItem,
  FormMessage,
  Input,
  Popover,
  PopoverAnchor,
  PopoverContent,
  Toggle,
} from "ui/primitive";
import type { LucideIcon } from "lucide-react";
import {
  Bold,
  Check,
  Code,
  Heading,
  Heading1,
  Heading3,
  Heading4,
  Italic,
  Link,
  Strikethrough,
  Subscript,
  Superscript,
  Underline,
  Undo,
  X,
  Heading2,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

export function EditorBold() {
  const { editor } = useCurrentEditor();
  if (!editor) return null;

  return (
    <Toggle
      onClick={() => {
        editor.chain().focus().toggleBold().run();
      }}
      pressed={editor.isActive("bold")}
      size="sm"
    >
      <Bold className="w-4 h-4" />
    </Toggle>
  );
}

export function EditorItalic() {
  const { editor } = useCurrentEditor();
  if (!editor) return null;

  return (
    <Toggle
      onClick={() => {
        editor.chain().focus().toggleItalic().run();
      }}
      pressed={editor.isActive("italic")}
      size="sm"
    >
      <Italic className="w-4 h-4" />
    </Toggle>
  );
}

export function EditorUnderline() {
  const { editor } = useCurrentEditor();
  if (!editor) return null;

  return (
    <Toggle
      onClick={() => {
        editor.chain().focus().toggleUnderline().run();
      }}
      pressed={editor.isActive("underline")}
      size="sm"
    >
      <Underline className="w-4 h-4" />
    </Toggle>
  );
}

export function EditorStrike() {
  const { editor } = useCurrentEditor();
  if (!editor) return null;

  return (
    <Toggle
      onClick={() => {
        editor.chain().focus().toggleStrike().run();
      }}
      pressed={editor.isActive("strike")}
      size="sm"
    >
      <Strikethrough className="w-4 h-4" />
    </Toggle>
  );
}

export function EditorSubscript() {
  const { editor } = useCurrentEditor();
  if (!editor) return null;

  return (
    <Toggle
      onClick={() => {
        editor.chain().focus().toggleSubscript().run();
      }}
      pressed={editor.isActive("strike")}
      size="sm"
    >
      <Subscript className="w-4 h-4" />
    </Toggle>
  );
}
export function EditorSuperscript() {
  const { editor } = useCurrentEditor();
  if (!editor) return null;

  return (
    <Toggle
      onClick={() => {
        editor.chain().focus().toggleSuperscript().run();
      }}
      pressed={editor.isActive("strike")}
      size="sm"
    >
      <Superscript className="w-4 h-4" />
    </Toggle>
  );
}

export function EditorCode() {
  const { editor } = useCurrentEditor();
  if (!editor) return null;

  return (
    <Toggle
      onClick={() => {
        editor.chain().focus().toggleCode().run();
      }}
      pressed={editor.isActive("code")}
      size="sm"
    >
      <Code className="w-4 h-4" />
    </Toggle>
  );
}

export function EditorUndo() {
  const { editor } = useCurrentEditor();
  if (!editor) return null;

  return (
    <Button
      disabled={!editor.can().undo()}
      onClick={() => {
        editor.chain().focus().undo().run();
      }}
      size="sm"
    >
      <Undo className="w-4 h-4" />
    </Button>
  );
}

export function EditorRedo() {
  const { editor } = useCurrentEditor();
  if (!editor) return null;

  return (
    <Button
      disabled={!editor.can().redo()}
      onClick={() => {
        editor.chain().focus().undo().run();
      }}
      size="sm"
    >
      <Undo className="w-4 h-4" />
    </Button>
  );
}

export function EditorLink() {
  const [prevUrl, setPrevUrl] = useState("");
  const [open, setOpen] = useState(false);

  const form = useForm<{ url: string }>({
    defaultValues: { url: prevUrl },
    resolver: zodResolver(
      z.object({
        url: z.string().url(),
      }),
    ),
  });

  const { editor } = useCurrentEditor();
  if (!editor) return null;

  const unsetLink = () => {
    editor.chain().focus().extendMarkRange("link").unsetLink().run();
    setOpen(false);
  };

  const onSubmit = ({ url }: { url: string }) => {
    setPrevUrl(url);
    if (url.length) {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url })
        .run();
      setOpen(false);
    } else unsetLink();
  };

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverAnchor asChild>
        <Toggle
          onClick={() => {
            setOpen(true);
          }}
          pressed={editor.isActive("link")}
          size="sm"
        >
          <Link className="h-4 w-4" />
        </Toggle>
      </PopoverAnchor>

      <PopoverContent className="p-2">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <div className="flex gap-2">
                    <Input autoComplete="off" placeholder="Link" {...field} />
                    <Button className="p-2" type="submit" variant="outline">
                      <Check className="w-4 h-4" />
                    </Button>
                    <Button
                      className="p-2"
                      onClick={unsetLink}
                      type="button"
                      variant="outline"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </PopoverContent>
    </Popover>
  );
}

export function EditorHeadingGroup() {
  const { editor } = useCurrentEditor();
  const [open, setOpen] = useState(false);

  if (!editor) return null;
  const headings: { level: 1 | 2 | 3 | 4 | 5 | 6; icon: LucideIcon }[] = [
    { level: 1, icon: Heading1 },
    { level: 2, icon: Heading2 },
    { level: 3, icon: Heading3 },
    { level: 4, icon: Heading4 },
  ];
  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverAnchor asChild>
        <Toggle
          onClick={() => {
            setOpen(true);
          }}
          pressed={editor.isActive("heading")}
          size="sm"
        >
          <Heading className="h-4 w-4" />
        </Toggle>
      </PopoverAnchor>

      <PopoverContent className="w-fit p-2">
        <div className="flex gap-1">
          {headings.map(({ level, icon: Icon }) => (
            <Toggle
              key={level}
              onPressedChange={() => {
                editor.chain().focus().toggleHeading({ level }).run();
              }}
              pressed={editor.isActive("heading", { level })}
            >
              <Icon className="h-4 w-4" />
            </Toggle>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
