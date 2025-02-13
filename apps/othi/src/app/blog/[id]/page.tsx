import { SudoGuard } from "@othi/components/SudoGuard";
import type { Params } from "lib/generics";
import { MoveLeft } from "lucide-react";
import Link from "next/link";
import { trpcServer } from "protocol/trpc/react/server";
import { Button, Separator } from "ui/primitive";
import { HtmlContent } from "@othi/components/typography";
import type { Metadata } from "next";
import { format } from "date-fns";

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  // this always runs until completion so loading files might not show up if
  // using the same action
  // TODO: cache the meta queries
  const id = params?.id as string;
  const data = await trpcServer.blog.byId({ id });
  const title = data?.meta.title;
  const description = "Othi's blog";
  return {
    title,
    // TODO: dynamic
    description,
    authors: {
      name: "Othi",
      url: "https://github.com/mnpqraven",
    },
    openGraph: {
      title,
      description,
      siteName: "othi.dev",
      url: `/blog/${id}`,
      locale: "en-US",
      type: "article",
    },
  };
}

export default async function Page({ params }: Params) {
  const id = params?.id as string;
  const data = await trpcServer.blog.byId({ id });

  if (!data) return "not found";

  const { meta, contentHtml } = data;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <Link
          className="text-muted-foreground flex items-center gap-2 hover:underline"
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

      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold capitalize">{meta.title}</h1>

        <span className="text-muted-foreground text-sm">
          Published at {format(meta.createdAt, "PPP")}
        </span>
      </div>

      <Separator />

      <HtmlContent html={contentHtml} markdown />
    </div>
  );
}
