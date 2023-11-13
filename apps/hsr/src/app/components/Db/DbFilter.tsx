import { range } from "lib/utils";
import Image from "next/image";
import { PathIcon } from "@hsr/app/character-db/PathIcon";
import { ElementIcon } from "@hsr/app/character-db/ElementIcon";
import { useEffect, useRef } from "react";
import type { Element, Path } from "@hsr/bindings/AvatarConfig";
import { Input, Toggle } from "ui/primitive";
import { ELEMENTS, PATHS } from "database/schema";

interface Prop {
  onEnterKey?: (searchText: string) => void;
  text?: boolean;
  minRarity?: number;
  updateText?: (query: string) => void;
  updateRarity?: (value: number) => void;
  updatePath?: (value: Path) => void;
  updateElement?: (value: Element) => void;
}

function DbFilter({
  onEnterKey,
  text = true,
  minRarity,
  updateText,
  updateRarity,
  updatePath,
  updateElement,
}: Prop) {
  const rarityList: number[] = Array.from(range(minRarity ?? 3, 5, 1));

  // keybinds
  const searchInput = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "f" && (e.ctrlKey || e.metaKey)) {
        // focus input
        e.preventDefault();
        searchInput.current?.focus();
      }
      if (e.key === "Enter" && onEnterKey) {
        e.preventDefault();
        onEnterKey(searchInput.current?.value ?? "");
      }
    };
    document.addEventListener("keydown", down);
    return () => {
      document.removeEventListener("keydown", down);
    };
  }, [onEnterKey]);

  return (
    <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
      {text && updateText ? (
        <div className="flex gap-2">
          <div className="relative h-full">
            <Input
              className="h-12 text-lg"
              onChange={(e) => {
                updateText(e.currentTarget.value);
              }}
              placeholder="Search"
              ref={searchInput}
            />

            <kbd className="bg-muted text-muted-foreground pointer-events-none absolute right-2 top-[calc(50%-10px)] inline-flex h-5 select-none items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100">
              <span className="text-xs">⌘/Ctrl + F</span>
            </kbd>
          </div>
        </div>
      ) : null}
      {minRarity && updateRarity ? (
        <div className="flex rounded-md border p-1">
          {rarityList.map((rarity) => (
            <Toggle
              className="text-muted-foreground hover:text-primary flex"
              key={rarity}
              onPressedChange={() => {
                updateRarity(rarity);
              }}
            >
              <span className="text-xl font-bold">{rarity}</span>
              <div className="aspect-square h-7">
                <Image
                  alt={`${rarity} ✦`}
                  className="pointer-events-none"
                  height={128}
                  src="/Star.png"
                  width={128}
                />
              </div>
            </Toggle>
          ))}
        </div>
      ) : null}
      {updatePath ? (
        <div className="flex rounded-md border p-1">
          {PATHS.map((path) => (
            <Toggle
              className="text-muted-foreground hover:text-primary"
              key={path}
              onPressedChange={() => {
                updatePath(path);
              }}
            >
              <PathIcon path={path} size="26px" />
            </Toggle>
          ))}
        </div>
      ) : null}
      {updateElement ? (
        <div className="flex rounded-md border p-1">
          {ELEMENTS.map((element) => (
            <Toggle
              key={element}
              onPressedChange={() => {
                updateElement(element);
              }}
            >
              <ElementIcon element={element} size="26px" />
            </Toggle>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export { DbFilter };
