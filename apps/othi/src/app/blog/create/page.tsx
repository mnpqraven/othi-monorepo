"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Blog, BlogInsert } from "database/schema/blog";
import { insertBlogSchema } from "database/schema/blog";
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Textarea,
  useToast,
} from "ui/primitive";
import { trpc } from "protocol";

export default function Page() {
  const { toast } = useToast();
  const form = useForm<Blog>({
    resolver: zodResolver(insertBlogSchema),
    defaultValues: {
      name: "",
      content: "",
    },
  });

  const { mutate } = trpc.othi.blog.create.useMutation({
    onSuccess({ success }) {
      toast({
        title: success ? "New blog created" : "Creating failed",
        variant: success ? "success" : "destructive",
      });
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((e) => {
          mutate(e);
        })}
      >
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
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Textarea {...field} autoComplete="off" />
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
