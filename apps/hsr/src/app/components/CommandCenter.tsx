"use client";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
  Button,
} from "ui/primitive";
import type { ComponentPropsWithoutRef, ElementRef } from "react";
import { forwardRef, useEffect, useState } from "react";
import type { Command as CommandPrimitive } from "cmdk";
import { useRouter } from "next/navigation";
import Fuse from "fuse.js";
import Image from "next/image";
import { cva } from "class-variance-authority";
import { range } from "lib";
import type { AvatarSchema, LightConeSchema } from "database/schema";
import { trpc } from "protocol";
import { PathIcon } from "../character-db/PathIcon";
import { ElementIcon } from "../character-db/ElementIcon";

const kbdVariants = cva(
  "bg-muted text-muted-foreground pointer-events-none hidden h-5 select-none items-center gap-1 rounded border px-1.5 font-mono font-medium opacity-100 sm:inline-block",
  {
    variants: {
      size: {
        sm: "text-[10px]",
        default: "text-[12px]",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

interface Route {
  path: string;
  label: string;
  icon: JSX.Element;
  keybind: string;
}

interface Prop {
  routes: Route[];
}

function CommandCenter({ routes }: Prop) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const { data: lightConeList } = trpc.honkai.lightCone.list.useQuery(
    {},
    { initialData: [] },
  );
  const { data: characterList } = trpc.honkai.avatar.list.useQuery(
    {},
    { initialData: [] },
  );
  const [filteredLc, setFilteredLc] = useState<LightConeSchema[]>([]);
  const [filteredChar, setFilteredChar] = useState<AvatarSchema[]>([]);

  const keysLc: (keyof LightConeSchema)[] = ["name", "path", "id"];
  const keysChar: (keyof AvatarSchema)[] = ["name", "element", "path", "id"];
  const fzLc = new Fuse(lightConeList, {
    keys: keysLc,
    threshold: 0.4,
  });
  const fzChar = new Fuse(characterList, {
    keys: keysChar,
    threshold: 0.4,
  });

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => {
      document.removeEventListener("keydown", down);
    };
  }, [router, routes]);

  function commandSelectRoute(path: string) {
    router.push(path);
    setOpen(false);
  }

  function onInputChange(to: string) {
    if (to !== "") {
      setFilteredLc(fzLc.search(to).map(({ item }) => item));
      setFilteredChar(fzChar.search(to).map(({ item }) => item));
    } else {
      setFilteredChar([]);
      setFilteredLc([]);
    }
  }

  useEffect(() => {
    if (!open) {
      setFilteredChar([]);
      setFilteredLc([]);
    }
  }, [open]);

  return (
    <>
      <Button
        className="text-muted-foreground w-fit"
        onClick={() => {
          setOpen(true);
        }}
        size="sm"
        variant="outline"
      >
        <span className="mr-4 hidden md:inline-block">Command Center</span>
        <span className="m-0 sm:mr-4 md:hidden">Cmd</span>
        <div className="flex">
          <kbd className={kbdVariants()}>⌘/Ctrl + K</kbd>
        </div>
      </Button>

      <CommandDialog loop onOpenChange={setOpen} open={open}>
        <CommandInput
          onValueChange={onInputChange}
          placeholder="Click on a result or search (character, light cone)..."
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {filteredChar.length > 0 && (
            <CommandGroup heading="Character">
              {filteredChar.map((chara) => (
                <CommandItem
                  className="w-full justify-between"
                  key={chara.id}
                  onSelect={() => {
                    router.push(`/character-db/${chara.id}`);
                    setOpen(false);
                  }}
                  value={keysChar.map((key) => chara[key]).join("-")}
                >
                  <div className="flex gap-2">
                    <PathIcon path={chara.path} size="auto" />
                    <ElementIcon element={chara.element} size="auto" />
                    <span>{chara.name}</span>
                  </div>

                  <div className="flex">
                    {Array.from(range(1, chara.rarity, 1)).map((rarity) => (
                      <Image
                        alt={`${rarity} *`}
                        height={20}
                        key={rarity}
                        src="/Star.png"
                        width={20}
                      />
                    ))}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
          {filteredLc.length > 0 && (
            <CommandGroup heading="Light Cone">
              {filteredLc.map((lc) => (
                <CommandItem
                  className="w-full justify-between"
                  key={lc.id}
                  onSelect={() => {
                    router.push(`/lightcone-db/${lc.id}`);
                    setOpen(false);
                  }}
                  value={keysLc.map((key) => lc[key]).join("-")}
                >
                  <div className="flex gap-2">
                    <PathIcon path={lc.path} size="auto" />
                    <span>{lc.name}</span>
                  </div>
                  <div className="flex">
                    {Array.from(range(1, lc.rarity, 1)).map((rarity) => (
                      <Image
                        alt={`${rarity} *`}
                        height={20}
                        key={rarity}
                        src="/Star.png"
                        width={20}
                      />
                    ))}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
          <CommandSeparator />
          <CommandGroup heading="Tools">
            {routes.map((route) => (
              <RouteItem
                key={route.path}
                onSelect={() => {
                  commandSelectRoute(route.path);
                }}
                {...route}
              />
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
export { CommandCenter };

interface RouteItemProps
  extends Route,
    ComponentPropsWithoutRef<typeof CommandItem> {}

const RouteItem = forwardRef<
  ElementRef<typeof CommandPrimitive.Item>,
  RouteItemProps
>(({ keybind, path, icon, label, onSelect, ...props }, ref) => {
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === keybind && (e.altKey || e.metaKey)) {
        e.preventDefault();
        if (onSelect) {
          onSelect(path);
        }
      }
    };
    document.addEventListener("keydown", down);
    return () => {
      document.removeEventListener("keydown", down);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <CommandItem onSelect={onSelect} {...props} ref={ref}>
      <span className="mr-2">{icon}</span>
      <span>{label}</span>
      {keybind ? (
        <CommandShortcut>
          <kbd className={kbdVariants()}>⌘/Alt + {keybind.toUpperCase()}</kbd>
        </CommandShortcut>
      ) : null}
    </CommandItem>
  );
});
RouteItem.displayName = "RouteItem";
