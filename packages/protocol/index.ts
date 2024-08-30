import type { JWT } from "next-auth/jwt";
import type { Session } from "next-auth";

export type { JWT, Session };

export {
  trpc,
  type RouterInputs,
  type RouterOutputs,
} from "./trpc/react/client";
