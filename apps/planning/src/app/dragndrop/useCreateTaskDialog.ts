import { atom, useAtom } from "jotai";
import { atomWithReset, useResetAtom } from "jotai/utils";
import { useEffect } from "react";

const openAtom = atom(false);
const creatingPreInfoAtom = atomWithReset<
  | {
      uuid: string;
      startTime: string;
      day: number;
    }
  | undefined
>(undefined);

export function useCreateTaskDialog() {
  const [open, setOpen] = useAtom(openAtom);
  const [preInfo, updatePreInfo] = useAtom(creatingPreInfoAtom);
  const resetPreInfo = useResetAtom(creatingPreInfoAtom);

  useEffect(() => {
    if (!open) resetPreInfo();
  }, [open, resetPreInfo]);

  return { open, setOpen, preInfo, updatePreInfo, resetPreInfo };
}
