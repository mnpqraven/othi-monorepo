"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Blog } from "database/schema/blog/blog";
import { insertBlogSchema } from "database/schema/blog/blog";
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

export default function Page() {
  const form = useForm<Blog>({
    resolver: zodResolver(insertBlogSchema),
    defaultValues: {
      name: "",
    },
  });

  function onSubmit(e: Blog) {
    // eslint-disable-next-line no-console
    console.log(e);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="name"
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

        <Button type="submit">Create</Button>
      </form>
    </Form>
  );
}
