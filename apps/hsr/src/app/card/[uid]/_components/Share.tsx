"use client";

import {
  Button,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  useToast,
} from "ui/primitive";
import { HTMLAttributes, forwardRef } from "react";
import { Share2 as ShareIcon } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import { env } from "@hsr/env";

export const Share = forwardRef<
  HTMLButtonElement,
  HTMLAttributes<HTMLButtonElement>
>((props, ref) => {
  const pathname = usePathname();
  const search = useSearchParams();
  const { toast } = useToast();

  function onShare() {
    const lang = search.get("lang");
    let url = env.NEXT_PUBLIC_BASE_URL + pathname;
    if (!!lang) {
      url += `?lang=${lang}`;
    }
    navigator.clipboard
      .writeText(url)
      .then(() => {
        toast({ description: "Url copied successfully" });
      })
      .catch(() => {
        toast({
          description: "Failed to copy Url",
          variant: "destructive",
        });
      });
  }
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="outline"
          className="px-2"
          onClick={onShare}
          {...props}
          ref={ref}
        >
          <ShareIcon />
        </Button>
      </TooltipTrigger>
      <TooltipContent>Share</TooltipContent>
    </Tooltip>
  );
});
Share.displayName = "Share";
