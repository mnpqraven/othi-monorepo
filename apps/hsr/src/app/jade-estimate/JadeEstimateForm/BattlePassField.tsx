import type { JadeEstimateCfg } from "protocol/ts";
import { BattlePassType } from "protocol/ts";
import type { UseFormReturn } from "react-hook-form";
import { Input, Separator } from "ui/primitive";
import * as F from "ui/primitive/form";
import * as S from "ui/primitive/select";

interface Prop {
  form: UseFormReturn<JadeEstimateCfg>;
}

function BattlePassField({ form }: Prop) {
  const battlePassType = form.watch("battlePass.battlePassType");

  return (
    <div className="rounded-md border p-4">
      <F.FormField
        control={form.control}
        name="battlePass.battlePassType"
        render={({ field }) => (
          <F.FormItem>
            <div className="flex flex-col items-center justify-between gap-2 sm:flex-row">
              <div className="space-y-1 sm:w-3/4">
                <F.FormLabel>Nameless Honor</F.FormLabel>
                <F.FormDescription className="text-justify">
                  If not selecting F2P, this assumes you&apos;ve received the
                  current patch&apos;s first time purchase rewards and those
                  won&apos;t be calculated.
                </F.FormDescription>
              </div>
              <S.Select
                defaultValue={String(BattlePassType.None)}
                onValueChange={(data) => {
                  const asInt = parseInt(data);
                  field.onChange(asInt);
                }}
                value={String(field.value)}
              >
                <F.FormControl>
                  <S.SelectTrigger className="max-w-fit">
                    <S.SelectValue />
                  </S.SelectTrigger>
                </F.FormControl>
                <S.SelectContent>
                  <S.SelectItem value={String(BattlePassType.None)}>
                    F2P
                  </S.SelectItem>
                  <S.SelectItem value={String(BattlePassType.Basic)}>
                    Nameless Glory
                  </S.SelectItem>
                  <S.SelectItem value={String(BattlePassType.Premium)}>
                    Nameless Medal
                  </S.SelectItem>
                </S.SelectContent>
              </S.Select>
              <F.FormMessage />
            </div>
          </F.FormItem>
        )}
      />
      {battlePassType !== BattlePassType.None && <Separator className="my-4" />}
      {battlePassType !== BattlePassType.None && (
        <F.FormField
          control={form.control}
          name="battlePass.currentLevel"
          render={({ field }) => (
            <F.FormItem className="w-full">
              <div className="flex flex-col items-center justify-between gap-2 sm:flex-row">
                <div className="space-y-1 sm:w-3/4">
                  <F.FormLabel>Current Nameless Honor Level</F.FormLabel>
                  <F.FormDescription className="text-justify">
                    This assumes you level up by 10 every Monday.
                    <br />
                    If you select Nameless Medal then keep in mind you also get
                    10 levels for free, please update the level accordingly.
                  </F.FormDescription>
                </div>
                <F.FormControl>
                  <Input
                    className="w-20 max-w-fit"
                    max={50}
                    min={0}
                    onKeyDown={(e) => {
                      if (e.code === "Minus") e.preventDefault();
                    }}
                    type="number"
                    {...field}
                    onChange={(e) => {
                      if (!Number.isNaN(e.currentTarget.value)) {
                        field.onChange(Number(e.currentTarget.value));
                      } else e.preventDefault();
                    }}
                  />
                </F.FormControl>
              </div>
              <F.FormMessage />
            </F.FormItem>
          )}
        />
      )}
    </div>
  );
}
export { BattlePassField };
