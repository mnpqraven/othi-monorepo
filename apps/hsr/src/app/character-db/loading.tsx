import type { Element } from "@hsr/bindings/AvatarSkillConfig";
import Image from "next/image";
import type { Path } from "@hsr/bindings/AvatarConfig";
import { Input, Toggle } from "ui/primitive";
import { range } from "lib";
import { PathIcon } from "./PathIcon";
import { ElementIcon } from "./ElementIcon";

export default function Loading() {
  const mockList = Array.from(range(1, 24, 1));
  const rarityList: number[] = Array.from(range(4, 5, 1));
  const pathList: Path[] = [
    "Destruction",
    "Hunt",
    "Erudition",
    "Preservation",
    "Harmony",
    "Nihility",
    "Abundance",
  ];
  const elementList: Element[] = [
    "Fire",
    "Ice",
    "Wind",
    "Lightning",
    "Physical",
    "Quantum",
    "Imaginary",
  ];

  return (
    <main className="container py-4">
      <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
        <div className="relative h-full">
          <Input className="h-12 text-lg" placeholder="Search" />
          <kbd className="bg-muted text-muted-foreground pointer-events-none absolute right-2 top-[calc(50%-10px)] inline-flex h-5 select-none items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100">
            <span className="text-xs">⌘/Ctrl + F</span>
          </kbd>
        </div>

        <div className="flex rounded-md border p-1">
          {rarityList.map((rarity) => (
            <Toggle
              className="text-muted-foreground hover:text-primary flex"
              key={rarity}
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

        <div className="flex rounded-md border p-1">
          {pathList.map((path) => (
            <Toggle
              className="text-muted-foreground hover:text-primary"
              key={path}
            >
              <PathIcon path={path} size="28px" />
            </Toggle>
          ))}
        </div>

        <div className="flex rounded-md border p-1">
          {elementList.map((element) => (
            <Toggle key={element}>
              <ElementIcon element={element} size="28px" />
            </Toggle>
          ))}
        </div>
      </div>

      <div className="grid scroll-m-4 grid-cols-2 items-center justify-center gap-2 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 md:gap-6 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7">
        {mockList.map((mockItem) => (
          <div key={mockItem} />
        ))}
      </div>
    </main>
  );
}
