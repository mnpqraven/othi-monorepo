import { db } from "database";
import type { AvatarSchema } from "database/schema";
import { avatars } from "database/schema";
import { publicProcedure, router } from "../../trpc";

export const avatarRouter = router({
  list: publicProcedure.query(async () => {
    return (await db.select().from(avatars).all()) satisfies Awaited<
      AvatarSchema[]
    >;
  }),
});
