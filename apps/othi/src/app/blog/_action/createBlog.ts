"use server";

import { createCaller } from "protocol/trpc";

export interface CreateBlogParams {
  tempBlogId: string;
  title: string;
  htmlString: string;
}
export async function createBlog({
  tempBlogId,
  htmlString,
  title,
}: CreateBlogParams) {
  // TODO: dynamic fn for context retrieval
  const caller = createCaller({
    role: "sudo",
  });
  // converting to MD string
  const markdownString = await caller.utils.blog.convertToMD({ htmlString });

  // upload MD blob
  const uploadedMDBlob = await caller.utils.blog.upload.markdownFile({
    markdownString,
    tempBlogId,
    title,
  });

  if (uploadedMDBlob) {
    const { name, url } = uploadedMDBlob;
    // upload MD meta to db index
    const _uploadedMeta = await caller.utils.blog.upload.blogMeta({
      title,
      fileName: name,
      mdUrl: url,
    });

    return { success: true };
  }
  return { success: false };
}
