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
      router.push(callbackUrl ?? "/");
    }
  }

  return (
    <div className="container flex flex-col items-center gap-4 pt-12">
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
          className="flex flex-col items-center gap-6"
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
