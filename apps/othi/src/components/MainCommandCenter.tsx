"use client";

import { commandOpenAtom, commandSearchInputAtom } from "@othi/lib/store";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "ui/primitive";
import { z } from "zod";

const routeConfSchema = z
  .object({
    name: z.string(),
    path: z.custom<`/${string}`>((val) => {
      return typeof val === "string" ? val.startsWith("/") : false;
    }),
    guard: z.boolean().optional().default(false),
  })
  .array();

const _routeConf: z.input<typeof routeConfSchema> = [
  { name: "sudo", path: "/sudo", guard: true },
  { name: "Home", path: "/" },
  { name: "About me", path: "/about-me" },
  { name: "Blog", path: "/blog" },
];

const routeConf = routeConfSchema.parse(_routeConf);

export function MainCommandCenter() {
  const [commandOpen, setCommandOpen] = useAtom(commandOpenAtom);
  const [search, setSearch] = useAtom(commandSearchInputAtom);
  const router = useRouter();
  const isSudo = search === "sudo";

  function viewable(guardOpt?: boolean) {
    // no guard = no check needed
    if (!guardOpt) return true;
    return isSudo;
  }

  useEffect(() => {
    // reset on open instead of on close to avoid content shift when the dialog
    // starts to close
    if (commandOpen) setSearch("");
  }, [commandOpen, setSearch]);

  return (
    <CommandDialog loop onOpenChange={setCommandOpen} open={commandOpen}>
      <CommandInput
        onValueChange={setSearch}
        placeholder="Type a command or search..."
        value={search}
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {routeConf.map(({ name, path, guard }) =>
            viewable(guard) ? (
              <CommandItem
                key={name}
                onSelect={() => {
                  setCommandOpen(false);
                  router.push(path);
                }}
              >
                {name}
              </CommandItem>
            ) : null,
          )}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
