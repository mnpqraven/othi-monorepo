import { HTMLAttributes, forwardRef } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "../primitive";

export const ThemeToggle = forwardRef<
  HTMLButtonElement,
  HTMLAttributes<HTMLButtonElement>
>(function ThemeToggle({ onClick, ...props }, ref) {
  const { theme, setTheme } = useTheme();

  function toggleTheme() {
    setTheme(theme === "light" ? "dark" : "light");
  }
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      {...props}
      ref={ref}
    >
      <Sun className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
});
