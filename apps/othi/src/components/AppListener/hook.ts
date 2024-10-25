import { useAtom } from "jotai";
import { isScrolledAtom } from "./store";

export function useViewportInfo() {
  const [isScrolled, setIsScrolled] = useAtom(isScrolledAtom);

  return { isScrolled, setIsScrolled };
}
