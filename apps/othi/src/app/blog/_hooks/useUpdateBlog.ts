import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { trpc } from "protocol";

export interface UpdateBlogParams {
  blogId: string;
  title: string;
  htmlString: string;
}
/**
 * NOTE: THIS HOOK REQUIRES SUSPENSE
 */
export function useUpdateBlog(
  { blogId }: { blogId: string },
  opt?: UseMutationOptions<unknown, Error, UpdateBlogParams>,
) {
  // TODO: dynamic fn for context retrieval
  const [currentMeta] = trpc.blog.byId.useSuspenseQuery({ id: blogId });
  const convertToMD = trpc.blog.convertToMD.useMutation();
  const updateMarkdownFile = trpc.blog.update.markdownFile.useMutation();
  const updateMeta = trpc.blog.update.meta.useMutation();

  async function action({ htmlString, title }: UpdateBlogParams) {
    if (!currentMeta)
      return { success: false as const, error: "current meta null" };

    // converting to MD string
    const markdownString = await convertToMD.mutateAsync({ htmlString });

    // update MD blob
    const updatedMD = await updateMarkdownFile.mutateAsync({
      markdownString,
      oldFileKey: currentMeta.meta.fileKey,
    });
    if (!updatedMD)
      return { success: false as const, error: "updatedMD is null" };

    const { fileKey, fileName, mdUrl } = updatedMD;
    const updatedMeta = await updateMeta.mutateAsync({
      id: blogId,
      title,
      fileKey,
      fileName,
      mdUrl,
    });

    // TODO: media

    return { success: true as const, data: updatedMeta.at(0) };
  }

  return useMutation({
    ...opt,
    mutationKey: ["blog", "update", blogId],
    mutationFn: action,
  });
}
