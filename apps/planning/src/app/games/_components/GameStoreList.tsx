"use client";

import { useAtomValue } from "jotai";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "ui/primitive";
import { GameStoreItem } from "./GameStoreItem";
import { gamesAtom, gamesSplittedAtom } from "../_schema/store";

export function GameStoreList() {
  const list = useAtomValue(gamesAtom);
  const listAtoms = useAtomValue(gamesSplittedAtom);
  return (
    <Accordion type="multiple">
      {listAtoms.map((atom, index) => (
        <AccordionItem value={`game-${index}`} key={`game-${index}`}>
          <AccordionTrigger>{list.at(index)?.name}</AccordionTrigger>
          <AccordionContent>
            <GameStoreItem atom={atom} key={index} />
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
