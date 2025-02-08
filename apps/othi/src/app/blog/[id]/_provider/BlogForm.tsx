"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  MultiCombobox,
  Switch,
} from "ui/primitive";
import { trpc } from "protocol";
import type { HTMLAttributes } from "react";
import { forwardRef } from "react";
import { cn } from "lib";
import { useBlogForm } from "./BlogFormProvider";

export const BlogForm = forwardRef<
  HTMLFormElement,
  HTMLAttributes<HTMLFormElement>
>(function BlogForm({ className, ...props }, ref) {
  const { data = [], isLoading } = trpc.blog.tag.list.useQuery();
  const { form } = useBlogForm();

  return (
    <Form {...form}>
      <form
        className={cn("flex flex-col gap-4", className)}
        ref={ref}
        {...props}
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

        <div className="grid grid-cols-2 gap-2">
          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tags</FormLabel>
                <FormControl>
                  <MultiCombobox
                    badge
                    isLoading={isLoading}
                    labelAccessor={(e) => e.label}
                    onValueChange={field.onChange}
                    options={data}
                    valueAccessor={(e) => e.code}
                    values={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="publish"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Published</FormLabel>
                <div className="h-10 flex items-center">
                  <FormControl>
                    <Switch
                      checked={field.value ?? undefined}
                      className="block"
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  );
});
