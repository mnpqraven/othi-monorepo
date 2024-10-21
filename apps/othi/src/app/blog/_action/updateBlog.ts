"use server";

import { createCaller } from "protocol/trpc";

export interface CreateBlogParams {
  blogId: string;
  title: string;
  htmlString: string;
}
export async function updateBlog({
  htmlString,
  title,
  blogId,
}: CreateBlogParams) {
  // TODO: dynamic fn for context retrieval
  const caller = createCaller({ role: "sudo" });
  const currentMeta = await caller.blog.byId({ id: blogId });

  if (!currentMeta)
    return { success: false as const, error: "current meta null" };

  // converting to MD string
  const markdownString = await caller.blog.convertToMD({ htmlString });

  // update MD blob
  const updatedMD = await caller.blog.update.markdownFile({
    markdownString,
    oldFileKey: currentMeta.meta.fileKey,
  });
  if (!updatedMD)
    return { success: false as const, error: "updatedMD is null" };

  const { fileKey, fileName, mdUrl } = updatedMD;
  const updatedMeta = await caller.blog.update.meta({
    id: blogId,
    title,
    fileKey,
    fileName,
    mdUrl,
  });

  // TODO: media

  return { success: true as const, data: updatedMeta.at(0) };
}
