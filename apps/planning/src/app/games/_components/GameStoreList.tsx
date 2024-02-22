import { gameStoreAtom, gameStoreSplittedAtom } from "@planning/app/_store";
import { useAtomValue } from "jotai";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "ui/primitive";
import { GameStoreItem } from "./GameStoreItem";

export function GameStoreList() {
  const list = useAtomValue(gameStoreAtom);
  const listAtoms = useAtomValue(gameStoreSplittedAtom);
  return (
    <Accordion type="multiple">
      {listAtoms.map((atom, index) => (
        <AccordionItem value={`game-${index}`}>
          <AccordionTrigger>{list.at(index)?.name}</AccordionTrigger>
          <AccordionContent>
            <GameStoreItem atom={atom} key={index} />
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
