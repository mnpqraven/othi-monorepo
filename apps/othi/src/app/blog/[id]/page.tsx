import { SudoGuard } from "@othi/components/SudoGuard";
import type { Params } from "lib/generics";
import { MoveLeft } from "lucide-react";
import Link from "next/link";
import { trpcServer } from "protocol/trpc/react/server";
import { Button } from "ui/primitive";
import { HtmlContent } from "@othi/components/typography";
import type { Metadata } from "next";

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const id = params?.id as string;
  const data = await trpcServer.blog.byId({ id });
  return {
    title: data?.meta.title,
    // TODO: dynamic
    authors: {
      name: "Othi",
      url: "https://github.com/mnpqraven",
    },
  };
}

export default async function Page({ params }: Params) {
  const id = params?.id as string;
  const data = await trpcServer.blog.byId({ id });

  if (!data) return "not found";

  const { meta, contentHtml } = data;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <Link
          className="flex gap-2 items-center hover:underline text-muted-foreground"
          href="/blog"
        >
          <MoveLeft className="h-4 w-4" />
          Back
        </Link>

        <SudoGuard>
          <Link href={`/blog/${id}/edit`}>
            <Button>Edit</Button>
          </Link>
        </SudoGuard>
      </div>

      <span>{meta.title}</span>

      <HtmlContent html={contentHtml} />
    </div>
  );
}
