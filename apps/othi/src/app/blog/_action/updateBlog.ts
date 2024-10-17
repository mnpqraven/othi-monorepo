import { createCaller } from "protocol/trpc";

export interface CreateBlogParams {
  oldFileName: string;
  tempBlogId: string;
  title: string;
  htmlString: string;
}
export async function updateBlog({
  oldFileName,
  tempBlogId,
  htmlString,
  title,
}: CreateBlogParams) {
  // TODO: dynamic fn for context retrieval
  const caller = createCaller({ role: "sudo" });
  // converting to MD string
  const markdownString = await caller.utils.blog.convertToMD({ htmlString });

  // upload MD blob
  const uploadedMDBlob = await caller.utils.blog.update.markdownFile({
    oldFileName,
    markdownString,
    tempBlogId,
    title,
  });

  if (uploadedMDBlob) {
    // updates MD meta in the db

    return { success: true };
  }
  return { success: false };
}
