import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { trpc } from "protocol";

export interface CreateBlogParams {
  tempBlogId: string;
  title: string;
  htmlString: string;
}
export function useCreateBlog(
  opt?: UseMutationOptions<unknown, Error, CreateBlogParams>,
) {
  // TODO: dynamic fn for context retrieval

  // converting to MD string
  const convertToMD = trpc.blog.convertToMD.useMutation();

  // upload MD blob
  const createMarkdownFile = trpc.blog.create.markdownFile.useMutation();

  const uploadedMeta = trpc.blog.create.meta.useMutation();

  async function action({ htmlString, tempBlogId, title }: CreateBlogParams) {
    // converting to MD string
    const markdownString = await convertToMD.mutateAsync({ htmlString });

    // upload MD blob
    const uploadedMDBlob = await createMarkdownFile.mutateAsync({
      markdownString,
      tempBlogId,
      title,
    });

    if (uploadedMDBlob) {
      const { name, url, key: fileKey } = uploadedMDBlob;
      // upload MD meta to db index
      const _uploadedMeta = uploadedMeta.mutateAsync({
        title,
        fileName: name,
        fileKey,
        mdUrl: url,
      });

      return { success: true };
    }
    return { success: false };
  }

  return useMutation({
    ...opt,
    mutationKey: ["blog", "create"],
    mutationFn: action,
  });
}
