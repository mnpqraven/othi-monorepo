"use client";

import { commandOpenAtom } from "@othi/lib/store";
import { useAtom } from "jotai";
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
  // TODO: items update, filter fn, hardcode for login
  return (
    <CommandDialog onOpenChange={setCommandOpen} open={commandOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem>Calendar</CommandItem>
          <CommandItem>Search Emoji</CommandItem>
          <CommandItem>Calculator</CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
