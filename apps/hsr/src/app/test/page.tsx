"use client";

import { z } from "zod";

type KeysMatching<T, V> = {
  [K in keyof T]-?: T[K] extends V ? K : never;
}[keyof T];

export function formArrayHelper<A, S extends z.ZodTypeAny>(
  schema: S,
  flow: "expand" | "truncate",
  keys: KeysMatching<z.TypeOf<S>, A[]>[],
  propertyName = "value"
) {
  return schema.transform((data) => {
    return Object.fromEntries(
      Object.entries(data).map(([key, arr]) => {
        if ((keys as string[]).includes(key)) {
          if (flow == "expand") {
            return [
              key,
              z
                .any()
                .array()
                .parse(arr)
                .map((e) => ({ [propertyName]: e })),
            ];
          } else {
            return [
              key,
              z
                .object({ value: z.any() })
                .array()
                .parse(arr)
                .map(({ value }) => value),
            ];
          }
        }
        return [key, arr];
      })
    );
  });
}

const testSchemaA = z.object({
  courierCompany: z.string(),
  courierCompanyUsers: z.array(z.object({ value: z.string() })),
});

const testSchema = z.object({
  courierCompany: z.string(),
  courierCompanyUsers: z.string().array(),
  nested: z.object({
    hello: z.number().array(),
    world: z.string(),
  }),
});

export default function Page() {
  const t = formArrayHelper(testSchema, "expand", ["courierCompanyUsers"]);

  const mock: z.TypeOf<typeof testSchema> = {
    courierCompany: "stars",
    courierCompanyUsers: ["arst", "ft"],
    nested: {
      hello: [1, 2, 3],
      world: "arst",
    },
  };

  // console.log(t.parse(mock));

  const a = formArrayHelper(testSchemaA, "truncate", ["courierCompanyUsers"]);

  const mmock: z.TypeOf<typeof testSchemaA> = {
    courierCompany: "stars",
    courierCompanyUsers: [{ value: "arst" }, { value: "wfwf" }],
  };
  console.log(a.parse(mmock));
  return <div></div>;
}
