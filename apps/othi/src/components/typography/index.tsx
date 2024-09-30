import React from "react";

interface HtmlContentProp {
  html: string;
}
export function HtmlContent({ html: contentHtml }: HtmlContentProp) {
  return <div dangerouslySetInnerHTML={{ __html: contentHtml }} />;
}
