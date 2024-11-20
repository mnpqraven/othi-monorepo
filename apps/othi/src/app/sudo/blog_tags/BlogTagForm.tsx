"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { BlogTag } from "database/schema";
import { insertBlogTagSchema } from "database/schema";
import { trpc } from "protocol";
import { useForm } from "react-hook-form";
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "ui/primitive";
import { toast } from "ui/primitive/sonner";

export function BlogTagForm() {
  const form = useForm<BlogTag>({
    resolver: zodResolver(insertBlogTagSchema),
    defaultValues: {
      label: "",
      code: "",
    },
  });
  const utils = trpc.useUtils();
  const { mutate } = trpc.othi.blogTag.create.useMutation({
    onSuccess() {
      void utils.othi.blogTag.list.invalidate();
      form.reset();
      toast("Success");
    },
  });

  return (
    <Form {...form}>
      <form
        className="flex gap-4"
        onSubmit={form.handleSubmit((e: BlogTag) => {
          mutate(e);
        })}
      >
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Code</FormLabel>
              <FormControl>
                <Input autoComplete="off" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="label"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Label</FormLabel>
              <FormControl>
                <Input autoComplete="off" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button className="mt-8" type="submit">Create</Button>
      </form>
    </Form>
  );
}
