import { createTRPCReact } from "@trpc/react-query";
import { type AppRouter } from "protocol/trpc";

export const trpc = createTRPCReact<AppRouter>({});
