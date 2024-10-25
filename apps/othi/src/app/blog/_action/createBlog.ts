// DEPECRATED

// "use server";
// import { createCaller } from "protocol/trpc";

// export interface CreateBlogParams {
//   tempBlogId: string;
//   title: string;
//   htmlString: string;
// }
// export async function createBlog({
//   tempBlogId,
//   htmlString,
//   title,
// }: CreateBlogParams) {
//   // TODO: dynamic fn for context retrieval
//   const caller = createCaller({ role: "sudo" });
//   // converting to MD string
//   const markdownString = await caller.blog.convertToMD({ htmlString });

//   // upload MD blob
//   const uploadedMDBlob = await caller.blog.create.markdownFile({
//     markdownString,
//     tempBlogId,
//     title,
//   });

//   if (uploadedMDBlob) {
//     const { name, url, key: fileKey } = uploadedMDBlob;
//     // upload MD meta to db index
//     const _uploadedMeta = await caller.blog.create.meta({
//       title,
//       fileName: name,
//       fileKey,
//       mdUrl: url,
//     });

//     return { success: true };
//   }
//   return { success: false };
// }
