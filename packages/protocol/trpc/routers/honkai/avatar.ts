import { db } from "database";
import { publicProcedure, router } from "../../trpc";
import { AvatarSchema, avatars } from "database/schema";

export const avatarRouter = router({
  list: publicProcedure.query(async () => {
    return (await db.select().from(avatars).all()) satisfies Awaited<
      AvatarSchema[]
    >;
  }),
});
