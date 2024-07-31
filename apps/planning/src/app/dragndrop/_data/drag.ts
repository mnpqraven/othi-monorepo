import { z } from "zod";
import { uuidSchema } from "./schema";

const prefixedUuidSchema = z
  .custom<`category_${string}`>((val) => {
    return typeof val === "string"
      ? val.startsWith(PREFIX) &&
          uuidSchema.safeParse(val.slice(PREFIX.length)).success
      : false;
  })
  .transform((val) => val.slice(PREFIX.length));

const PREFIX = "category_" as const;

export class CategoryDragId {
  readonly uuid: string;
  readonly id: `${typeof PREFIX}${string}`;

  constructor(uuidOrId: string) {
    const schema = uuidSchema.or(prefixedUuidSchema);
    const uuid = schema.parse(uuidOrId);
    this.uuid = uuid;
    this.id = `${PREFIX}${uuid}`;
  }
}
