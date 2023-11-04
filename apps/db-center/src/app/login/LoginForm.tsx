"use client";

import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import {
  useToast,
  Button,
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  Input,
  FormMessage,
} from "ui/primitive";
import { env } from "@db-center/env";

export default function LoginForm() {
  const form = useForm<{ username: string; password: string }>({
    defaultValues: {
      username: "",
      password: "",
    },
  });
  const query = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const callbackUrl = query.get("callbackUrl");

  async function onSubmit(values: { username: string; password: string }) {
    const res = await signIn("credentials", {
      redirect: false,
      callbackUrl: callbackUrl ?? "/",
      username: values.username,
      password: values.password,
    });
    if (!res?.ok) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Login failed",
      });
    } else {
      router.push(
        callbackUrl?.startsWith(env.NEXT_PUBLIC_BASE_URL) ? callbackUrl : "/"
      );
    }
  }

  return (
    <div className="flex flex-col gap-4 items-center container pt-12">
      <Button
        className="w-fit"
        onClick={() =>
          void signIn("github", { callbackUrl: callbackUrl ?? "/" })
        }
      >
        Sign in with Github
      </Button>

      <div>Or</div>

      <Form {...form}>
        <form
          className="flex flex-col gap-6 items-center"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Sign In</Button>
        </form>
      </Form>
    </div>
  );
}
