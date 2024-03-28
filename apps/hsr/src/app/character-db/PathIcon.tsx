"use client";

import type { Path } from "@hsr/bindings/AvatarConfig";
import { useTheme } from "next-themes";
import type { HTMLAttributes } from "react";
import { forwardRef, useEffect, useState } from "react";
import Svg from "react-inlinesvg";

interface Prop extends HTMLAttributes<HTMLDivElement> {
  path: Path;
  /**
   * this is getting passed into `style` props of the wrapping div
   */
  size: string;
  iconClass?: string;
  ignoreTheme?: boolean;
}

const PathIcon = forwardRef<HTMLDivElement, Prop>(
  (
    { path, size, iconClass: className, ignoreTheme = false, ...props },
    ref,
  ) => {
    const { theme } = useTheme();
    const filterDark = { filter: "drop-shadow(1px 1px 1px rgb(0 0 0 / 1))" };
    const filterLight = {
      filter: "drop-shadow(1px 1px 1px rgb(134 140 136 / 1))",
    };
    const [filter, setFilter] = useState(filterLight);
    useEffect(() => {
      if (!ignoreTheme) {
        if (theme === "light") setFilter(filterDark);
        else setFilter(filterLight);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [theme]);

    return (
      <div ref={ref} style={{ width: size, height: size }} {...props}>
        <Svg
          className={className}
          height="100%"
          src={`/path/${path}.svg`}
          style={filter}
          viewBox="0 0 14 14"
          width="100%"
        />
      </div>
    );
  },
);
PathIcon.displayName = "PathIcon";

export { PathIcon };
