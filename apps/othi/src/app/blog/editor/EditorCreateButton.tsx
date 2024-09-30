"use client";

import { useCurrentEditor } from "@tiptap/react";
import { Button } from "ui/primitive";
import { useAtom } from "jotai";
import { editorTempBlogIdAtom } from "@othi/components/editor/store";
import { RESET } from "jotai/utils";
import type { UseFormReturn } from "react-hook-form";
import type { Blog } from "database/schema";
import { toast } from "ui/primitive/sonner";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { createBlog } from "../_action/createBlog";

export function EditorCreateButton({ form }: { form: UseFormReturn<Blog> }) {
  const { editor } = useCurrentEditor();
  const router = useRouter();
  const nameSubscriber = form.watch("title");
  const disabled = editor?.isEmpty || !nameSubscriber.length;
  const [tempBlogId, reset] = useAtom(editorTempBlogIdAtom);

  const { mutate, isPending } = useMutation({
    mutationKey: ["blog", "upload"],
    mutationFn: createBlog,
    onSuccess: () => {
      toast("Upload complete");
      router.push("/blog");
      reset(RESET);
    },
  });

  async function onCreate() {
    const valid = await form.trigger();
    if (editor && valid && tempBlogId) {
      await form.handleSubmit(({ title }) => {
        mutate({ htmlString: editor.getHTML(), tempBlogId, title });
      })();
    }
  }

  return !editor ? null : (
    <Button
      className="gap-1 items-center"
      disabled={disabled || isPending}
      onClick={onCreate}
      type="button"
    >
      {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
      Create
    </Button>
  );
}
