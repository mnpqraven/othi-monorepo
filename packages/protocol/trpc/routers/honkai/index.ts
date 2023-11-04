import { router } from "../../trpc";
import { avatarRouter } from "./avatar";
import { itemRouter } from "./item";
import { skillRouter } from "./skill";

// TODO: filter conditional
export const honkaiRouter = router({
  avatar: avatarRouter,
  skill: skillRouter,
  item: itemRouter,
});
