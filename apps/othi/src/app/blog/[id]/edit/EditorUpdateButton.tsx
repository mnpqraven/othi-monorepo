"use client";

import { useCurrentEditor } from "@tiptap/react";
import { Button } from "ui/primitive";
import type { UseFormReturn } from "react-hook-form";
import type { Blog } from "database/schema";
import { toast } from "ui/primitive/sonner";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
// import { useUpdateBlog } from "../../_hooks/useUpdateBlog";

interface Prop {
  blogId: string;
  form: UseFormReturn<Blog>;
}
export function EditorUpdateButton({ form, blogId }: Prop) {
  const { editor } = useCurrentEditor();
  const router = useRouter();
  const nameSubscriber = form.watch("title");
  const disabled = editor?.isEmpty || !nameSubscriber.length;

  // const { mutate, isPending } = useUpdateBlog(
  //   { blogId },
  //   {
  //     onSuccess: () => {
  //       toast("Update complete");
  //       router.push("/blog");
  //     },
  //   },
  // );

  async function onCreate() {
    const valid = await form.trigger();
    if (editor && valid) {
      await form.handleSubmit(({ title }) => {
        // mutate({ htmlString: editor.getHTML(), blogId, title });
      })();
    }
  }

  return !editor ? null : (
    <Button
      className="gap-1 items-center"
      // disabled={disabled || isPending}
      onClick={onCreate}
      type="button"
    >
      {/* {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null} */}
      Update
    </Button>
  );
}
