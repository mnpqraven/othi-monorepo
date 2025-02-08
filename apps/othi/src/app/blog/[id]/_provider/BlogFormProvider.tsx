"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  editorTempBlogIdAtom,
  generateEditorTempBlogIdAtom,
} from "@othi/components/editor/store";
import { insertBlogSchema, insertBlogTagSchema } from "database/schema";
import { useSetAtom } from "jotai";
import { RESET } from "jotai/utils";
import { useRouter } from "next/navigation";
import type { RouterInputs } from "protocol";
import { trpc } from "protocol";
import { createContext, useContext, useEffect, type ReactNode } from "react";
import type { UseFormReturn } from "react-hook-form";
import { useForm } from "react-hook-form";
import { toast } from "ui/primitive/sonner";
import type { z } from "zod";

const metaForm = insertBlogSchema
  .pick({
    title: true,
    publish: true,
  })
  .extend({
    tags: insertBlogTagSchema.shape.code.array().optional(),
  });
type MetaForm = z.TypeOf<typeof metaForm>;

export function useBlogForm() {
  const {
    form,
    id,
    update,
    create,
    isPending = false,
  } = useContext(BlogFormContext);
  if (!form || !update || !create)
    throw new Error(
      "context value cant be undefined, did you use this hook outside <BlogFormProvider/> ?",
    );

  return { form, blogId: id, update, create, isPending };
}

interface ContextProps {
  form: UseFormReturn<MetaForm>;
  id?: string;
  update: (values: RouterInputs["blog"]["update"]["everything"]) => void;
  create: (values: RouterInputs["blog"]["create"]["everything"]) => void;
  isPending: boolean;
}
const BlogFormContext = createContext<Partial<ContextProps>>({});

interface ProviderProps {
  children: ReactNode;
  id?: string;
  defaultValue?: MetaForm;
  mode: "create" | "update";
}
export function BlogFormProvider({
  children,
  id,
  defaultValue,
  mode,
}: ProviderProps) {
  const router = useRouter();
  const form = useForm<MetaForm>({
    resolver: zodResolver(metaForm),
    defaultValues: {
      title: "",
      ...defaultValue,
    },
  });
  const createTempBlogId = useSetAtom(generateEditorTempBlogIdAtom);
  const reset = useSetAtom(editorTempBlogIdAtom);

  // generates a new id on render
  useEffect(() => {
    if (mode === "create") createTempBlogId();
    return () => {
      reset(RESET);
    };
  }, [createTempBlogId, reset, mode]);

  const { mutate: update, isPending: isUpdating } =
    trpc.blog.update.everything.useMutation({
      onSuccess() {
        toast.success("Blog updated");
        router.push("/blog");
      },
    });

  const { mutate: create, isPending: isCreating } =
    trpc.blog.create.everything.useMutation({
      onSuccess() {
        toast.success("Blog created");
        router.push("/blog");
        reset(RESET);
      },
    });
  const isPending = isUpdating || isCreating;

  return (
    <BlogFormContext.Provider
      value={{
        id,
        form,
        update,
        create,
        isPending,
      }}
    >
      {children}
    </BlogFormContext.Provider>
  );
}
