import { useAtom } from "jotai";
import { isScrolledAtom } from "./store";

export function useViewportInfo() {
  const [isScrolled, _setIsScrolled] = useAtom(isScrolledAtom);

  return { isScrolled, _setIsScrolled };
}
