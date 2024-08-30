"use client";

import {
  commandAtom,
  commandOpenAtom,
  commandSearchInputAtom,
} from "@othi/lib/store";
import { useAtom } from "jotai";
import { useResetAtom } from "jotai/utils";
import { useRouter } from "next/navigation";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "ui/primitive";

export function MainCommandCenter() {
  const [commandOpen, setCommandOpen] = useAtom(commandOpenAtom);
  const [search, setSearch] = useAtom(commandSearchInputAtom);
  const reset = useResetAtom(commandAtom);
  const router = useRouter();

  const isSudo = search === "sudo";

  return (
    <CommandDialog onOpenChange={setCommandOpen} open={commandOpen}>
      <CommandInput
        onValueChange={setSearch}
        placeholder="Type a command or search..."
        value={search}
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          {isSudo ? (
            <CommandItem
              onSelect={() => {
                reset();
                router.push("/sudo");
              }}
              value="sudo"
            >
              sudo
            </CommandItem>
          ) : null}
          <CommandItem>Calendar</CommandItem>
          <CommandItem>Search Emoji</CommandItem>
          <CommandItem>Calculator</CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
