import type { HTMLAttributes } from "react";
import { forwardRef } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "../primitive";

type Props = Omit<HTMLAttributes<HTMLButtonElement>, "onClick">;

export const ThemeToggle = forwardRef<HTMLButtonElement, Props>(
  function ThemeToggle({ ...props }, ref) {
    const t = useTheme();
    const { theme, setTheme } = t;

    function toggleTheme() {
      console.log(t);
      setTheme(theme === "light" ? "dark" : "light");
    }
    return (
      <Button
        onClick={toggleTheme}
        size="sm"
        variant="ghost"
        {...props}
        ref={ref}
      >
        <Sun className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    );
  },
);
