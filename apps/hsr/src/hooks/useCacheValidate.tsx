import { useEffect, useState } from "react";
import { ToastAction, useToast } from "ui/primitive";
import type * as z from "zod";

interface Prop<T> {
  schema: z.ZodSchema<T>;
  schemaData: T;
  onReload: () => void;
}

export function useCacheValidate<T>({ schema, schemaData, onReload }: Prop<T>) {
  const { toast } = useToast();
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    const { success } = schema.safeParse(schemaData);

    if (!pressed && Boolean(schemaData) && !success) {
      toast({
        variant: "destructive",
        title: "Outdated Local Cache",
        description:
          "The local cache seems to be outdated, this is usually due to an update to the website, if you are seeing this please click the following 'Reload' button.",
        action: (
          <ToastAction
            altText="Reload"
            onClick={() => {
              onReload();
              setPressed(true);
            }}
          >
            Reload
          </ToastAction>
        ),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pressed, schemaData]);
}
