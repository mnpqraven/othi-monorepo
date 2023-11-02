import { db } from "@/lib/database";
import { publicProcedure, router } from "../trpc";
import { avatars } from "@/dbSchemas/avatar";
import { items } from "@/dbSchemas/item";

// TODO: filter conditional
export const honkaiRouter = router({
  test: publicProcedure.query(async () => {
    console.log("runing on");
    return Promise.resolve("world");
  }),
  avatar: router({
    list: publicProcedure.query(async () => {
      return db.select().from(avatars).all();
    }),
  }),
  item: publicProcedure.query(async () => {
    return db.select().from(items).all();
  }),
});
