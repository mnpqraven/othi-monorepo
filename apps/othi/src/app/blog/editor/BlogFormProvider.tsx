"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { Blog } from "database/schema";
import { insertBlogSchema } from "database/schema";
import type { ReactNode } from "react";
import type { UseFormReturn } from "react-hook-form";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "ui/primitive";

interface Prop {
  children: ReactNode;
  form: UseFormReturn<Blog>;
}

export function useBlogForm(defaultValue?: Partial<Blog>) {
  const form = useForm<Blog>({
    resolver: zodResolver(insertBlogSchema.pick({ title: true })),
    defaultValues: defaultValue ?? {
      title: "",
    },
  });

  function onSubmit(e: Blog) {
    // eslint-disable-next-line no-console
    console.log(e);
  }

  return { form, onSubmit };
}

export function BlogFormProvider({ form, children }: Prop) {
  const { onSubmit } = useBlogForm();

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} autoComplete="off" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {children}
      </form>
    </Form>
  );
}
