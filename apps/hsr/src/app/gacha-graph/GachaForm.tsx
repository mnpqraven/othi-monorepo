import { useBannerList } from "@hsr/hooks/queries/useGachaBannerList";
import { useForm } from "react-hook-form";
import { useDebounce } from "@hsr/hooks/useDebounce";
import type { PlainMessage } from "@bufbuild/protobuf";
import type { Banner } from "@hsr/bindings/Banner";
import type { ProbabilityRatePayload } from "protocol/ts";
import { BannerType } from "protocol/ts";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
} from "ui/primitive";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAtom } from "jotai";
import { isEmpty, range } from "lib";
import { useEffect, useState } from "react";
import equal from "fast-deep-equal/react";
import { useCacheValidate } from "@hsr/hooks/useCacheValidate";
import { RESET } from "jotai/utils";
import { gachaGraphFormAtom } from "./store";
import { schema } from "./schema";
import { defaultGachaQuery } from "./types";

type FormSchema = PlainMessage<ProbabilityRatePayload>;

interface Prop {
  selectedBanner: Banner;
}

export function GachaForm({ selectedBanner }: Prop) {
  const { data: bannerList } = useBannerList();

  const [storagedForm, setStoragedForm] = useAtom(gachaGraphFormAtom);

  const form = useForm<FormSchema>({
    resolver: zodResolver(schema),
    defaultValues: storagedForm,
  });
  const onDebouncedSubmit = useDebounce(form.handleSubmit(onSubmit), 300);
  const [storageRetrieved, setStorageRetrieved] = useState(false);

  useCacheValidate({
    schema,
    schemaData: storagedForm,
    onReload: () => {
      setStoragedForm(RESET);
      form.reset(defaultGachaQuery);
    },
  });
  useEffect(() => {
    if (!storageRetrieved && !equal(storagedForm, defaultGachaQuery)) {
      form.reset(storagedForm);
      setStorageRetrieved(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storagedForm]);

  function onSubmit(values: FormSchema) {
    setStoragedForm(values);
  }

  function preventMinus(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.code === "Minus") e.preventDefault();
  }

  return (
    <Form {...form}>
      <form onChange={onDebouncedSubmit}>
        <div className="flex flex-col flex-wrap justify-evenly gap-y-4 rounded-md border p-4 md:flex-row md:space-x-4">
          <FormField
            control={form.control}
            name="banner"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Banner</FormLabel>
                <Select
                  onValueChange={(numericValue) => {
                    if (!isEmpty(numericValue))
                      field.onChange(Number(numericValue));
                  }}
                  value={String(field.value)}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent position="popper">
                    {bannerList.map(({ bannerName, bannerType }) => (
                      <SelectItem
                        key={BannerType[bannerType]}
                        value={String(BannerType[bannerType])}
                      >
                        {bannerName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="pulls"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total Available Rolls</FormLabel>
                <FormControl>
                  <Input
                    min={0}
                    onKeyDown={preventMinus}
                    type="number"
                    {...field}
                    onChange={(e) => {
                      field.onChange(parseInt(e.target.value));
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="pity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pulls since last 5✦</FormLabel>
                <FormControl>
                  <Input
                    max={89}
                    min={0}
                    onKeyDown={preventMinus}
                    type="number"
                    {...field}
                    onChange={(e) => {
                      field.onChange(parseInt(e.target.value));
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="currentEidolon"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current {selectedBanner.constPrefix}</FormLabel>
                <Select
                  onValueChange={(e) => {
                    field.onChange(parseInt(e));
                  }}
                  value={String(field.value)}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent position="popper">
                    <SelectItem value="-1">Not Owned</SelectItem>
                    {Array.from(
                      range(
                        selectedBanner.minConst + 1,
                        selectedBanner.maxConst - 1,
                        1,
                      ),
                    ).map((e) => (
                      <SelectItem key={e} value={String(e)}>
                        {selectedBanner.constPrefix}{" "}
                        {selectedBanner.bannerType === "LC" ? e + 1 : e}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="nextGuaranteed"
            render={({ field }) => (
              <FormItem>
                <div className="flex h-full flex-col">
                  <div>
                    <FormLabel htmlFor="isGuaranteed">
                      Next 5✦ Guaranteed
                    </FormLabel>
                  </div>
                  <div className="mt-2 flex h-full flex-col justify-center">
                    <FormControl>
                      <Switch
                        checked={field.value}
                        id="isGuaranteed"
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </div>
                </div>
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  );
}
