"use client";

import {
  commandSearchInputAtom,
  useCommandReducer,
  useSetCommandReducer,
} from "@othi/lib/store";
import { useAtom, useAtomValue } from "jotai";
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
import { useTheme } from "next-themes";

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
  const [search, setSearch] = useAtom(commandSearchInputAtom);

  const [commandCenter, dispatch] = useCommandReducer();

  useEffect(() => {
    const keyFn = (e: KeyboardEvent) => {
      if (e.key === "Backspace" && !search.length) {
        dispatch({ type: "goParent", payload: undefined });
      }
    };

    window.addEventListener("keydown", keyFn);

    return () => {
      window.removeEventListener("keydown", keyFn);
    };
  }, [dispatch, search.length]);

  return (
    <CommandDialog
      loop
      onOpenChange={(payload) => {
        dispatch({ type: "toggleOpen", payload });
      }}
      open={commandCenter.openState}
    >
      <CommandInput
        onValueChange={setSearch}
        placeholder="Type a command or search..."
        slotBefore={
          <div className="mr-2 inline-flex flex-nowrap gap-1">
            {commandCenter.levelName.map((n) => (
              <code className="text-nowrap" key={n}>{`/${n}`}</code>
            ))}
          </div>
        }
        value={search}
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        {commandCenter.levelDepth === 0 ? <CommandGroupRoot /> : null}
        {commandCenter.levelDepth === 1 &&
        commandCenter.levelName.at(0) === "theme" ? (
          <CommandGroupTheme />
        ) : null}
        {commandCenter.levelDepth === 1 &&
        commandCenter.levelName.at(0) === "go" ? (
          <CommandGroupGo />
        ) : null}
      </CommandList>
    </CommandDialog>
  );
}

function CommandGroupRoot() {
  const dispatch = useSetCommandReducer();
  return (
    <CommandGroup heading="Command">
      <CommandItem
        onSelect={() => {
          dispatch({ type: "goLevel", payload: { levelName: "theme" } });
        }}
      >
        <code className="mr-2">/theme</code> Set theme
      </CommandItem>
      <CommandItem
        onSelect={() => {
          dispatch({ type: "goLevel", payload: { levelName: "go" } });
        }}
      >
        <code className="mr-2">/go</code> Go to page
      </CommandItem>
    </CommandGroup>
  );
}

function CommandGroupTheme() {
  const { setTheme } = useTheme();
  return (
    <CommandGroup heading="Theme">
      <CommandItem
        onSelect={() => {
          setTheme("dark");
        }}
      >
        Dark
      </CommandItem>
      <CommandItem
        onSelect={() => {
          setTheme("light");
        }}
      >
        Light
      </CommandItem>
      <CommandItem
        onSelect={() => {
          setTheme("system");
        }}
      >
        System
      </CommandItem>
    </CommandGroup>
  );
}

function CommandGroupGo() {
  const search = useAtomValue(commandSearchInputAtom);
  const dispatch = useSetCommandReducer();
  const isSudo = search === "sudo";
  const routes = routeConf.filter(({ guard }) => viewable(guard));
  const router = useRouter();

  function viewable(guardOpt?: boolean) {
    // no guard = no check needed
    if (!guardOpt) return true;
    return isSudo;
  }
  return (
    <CommandGroup heading="Command">
      {routes.map((route) => (
        <CommandItem
          key={route.path}
          onSelect={() => {
            router.push(route.path);
            dispatch({ type: "toggleOpen", payload: false });
          }}
        >
          {route.name}
        </CommandItem>
      ))}
    </CommandGroup>
  );
}
