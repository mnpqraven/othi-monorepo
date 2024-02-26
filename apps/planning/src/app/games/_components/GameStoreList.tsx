"use client";

import { useAtomValue } from "jotai";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "ui/primitive";
import { gamesAtom, gamesSplittedAtom } from "../_schema/store";
import { GameStoreItem } from "./GameStoreItem";

export function GameStoreList() {
  const list = useAtomValue(gamesAtom);
  const listAtoms = useAtomValue(gamesSplittedAtom);
  return (
    <Accordion type="multiple">
      {listAtoms.map((atom, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <AccordionItem key={`game-${index}`} value={`game-${index}`}>
          <AccordionTrigger>{list.at(index)?.name}</AccordionTrigger>
          <AccordionContent className="p-4">
            <GameStoreItem atom={atom} index={index} />
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
