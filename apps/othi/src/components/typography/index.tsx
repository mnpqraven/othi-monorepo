import { cn } from "lib";
import React from "react";

interface HtmlContentProp {
  className?: string;
  html: string;
  markdown?: boolean;
}
export function HtmlContent({
  html: contentHtml,
  className,
  markdown,
}: HtmlContentProp) {
  return (
    <div
      className={cn(className, markdown ? "markdown" : null)}
      dangerouslySetInnerHTML={{ __html: contentHtml }}
    />
  );
}
