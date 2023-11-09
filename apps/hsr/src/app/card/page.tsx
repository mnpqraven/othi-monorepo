"use client";

import type { UseFormReturn } from "react-hook-form";
import { useForm } from "react-hook-form";
import { LANG, LANGS } from "@hsr/lib/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Pin, PinOff } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { PrimitiveAtom } from "jotai";
import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormSelect,
  Input,
  Toggle,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "ui/primitive";
import { cachedProfileAtoms, cachedProfilesAtom } from "./_store/main";
import type { MihomoPlayer } from "./types";
import { PlayerCard } from "./PlayerCard";
import { useMihomoInfo } from "./[uid]/useMihomoInfo";

const schema = z.object({
  uid: z
    .string()
    .min(1, { message: "Player UID must contain at least 1 character" })
    .refine(
      (val) =>
        z.string().regex(/^\d+$/).transform(Number).safeParse(val).success,
      { message: "Invalid number" }
    ),
  lang: z.enum(LANGS),
});
type FormSchema = z.infer<typeof schema>;

const defaultValues: FormSchema = { uid: "", lang: "en" };

export default function Profile() {
  const router = useRouter();
  const form = useForm<FormSchema>({
    defaultValues,
    resolver: zodResolver(schema),
  });
  const { uid: uidError } = form.formState.errors;
  const [prof, setProf] = useState(defaultValues);
  const { query, prefetch } = useMihomoInfo(prof);

  const playerProfileAtoms = useAtomValue(cachedProfileAtoms);
  const queryProfileAtom = useMemo(
    () => atom(query.data?.player),
    [query.data]
  );
  const queryProfile = useAtomValue(queryProfileAtom);

  useEffect(() => {
    if (query.data) {
      const la = prof.lang === "en" ? "" : `?lang=${prof.lang}`;
      const url = `/card/${prof.uid}${la}`;
      router.prefetch(url);
      prefetch(prof.uid, prof.lang);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.data]);

  return (
    <main className="flex flex-col items-center gap-12">
      <div className="flex flex-col gap-2">
        <UidForm form={form} onSubmit={setProf} />

        <div className="text-destructive text-center">{uidError?.message}</div>
      </div>

      {query.isLoading ? <Loader2 className="mr-1 animate-spin" /> : null}
      {Boolean(queryProfile) && (
        <div className="flex items-center gap-3">
          <PinProfileButton atom={queryProfileAtom} />

          <PlayerCard atom={queryProfileAtom} lang={form.watch("lang")} />
        </div>
      )}
      {playerProfileAtoms.length > 0 && (
        <>
          <h1>Saved Profile</h1>
          <div className="flex flex-col gap-4">
            {playerProfileAtoms.map((profileAtom, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <div className="flex items-center gap-3" key={index}>
                <UnpinButton atom={profileAtom} />

                <PlayerCard atom={profileAtom} />
              </div>
            ))}
          </div>
        </>
      )}
    </main>
  );
}

interface PinProps {
  atom: PrimitiveAtom<MihomoPlayer | undefined>;
}
function PinProfileButton({ atom }: PinProps) {
  const [profiles, setProfiles] = useAtom(cachedProfilesAtom);
  // safe define
  const current = useAtomValue(atom);
  const pressed = profiles.find((e) => e.uid === current?.uid);

  function updatePin() {
    // delete
    if (pressed) setProfiles(profiles.filter((e) => e.uid !== current?.uid));
    // append
    else if (current) setProfiles([...profiles, current]);
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Toggle onPressedChange={updatePin}>
          {pressed ? (
            <PinOff className="h-4 w-4" />
          ) : (
            <Pin className="h-4 w-4" />
          )}
        </Toggle>
      </TooltipTrigger>
      <TooltipContent>{pressed ? "Unsave" : "Save"}</TooltipContent>
    </Tooltip>
  );
}

interface UidFormProps {
  form: UseFormReturn<FormSchema>;
  onSubmit: (values: FormSchema) => void;
}
function UidForm({ form, onSubmit }: UidFormProps) {
  return (
    <Form {...form}>
      <form
        className="mt-12 flex flex-col items-center justify-center gap-4 md:flex-row md:items-start"
        id="form"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          name="uid"
          render={({ field }) => (
            <FormItem>
              <FormLabel>UID</FormLabel>
              <FormControl>
                <Input
                  className="w-56"
                  placeholder="Enter your UID..."
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormSelect<[string, string], FormSchema>
          label="Language"
          labelAccessor={([_, label]) => label}
          name="lang"
          options={Object.entries(LANG)}
          valueAccessor={([lang, _]) => lang}
        />

        <Button className="self-end" form="form" size="sm" type="submit">
          Search
        </Button>

        <Link className="self-end" href="/card/custom">
          <Button
            className="w-fit items-center"
            size="sm"
            type="button"
            variant="outline"
          >
            Custom card
          </Button>
        </Link>
      </form>
    </Form>
  );
}

interface UnpinProps {
  atom: PrimitiveAtom<MihomoPlayer>;
}
function UnpinButton({ atom }: UnpinProps) {
  const setPlayerProfileAtoms = useSetAtom(cachedProfileAtoms);
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Toggle
          onPressedChange={() => {
            setPlayerProfileAtoms({
              type: "remove",
              atom,
            });
          }}
        >
          <PinOff className="h-4 w-4" />
        </Toggle>
      </TooltipTrigger>
      <TooltipContent>Unsave</TooltipContent>
    </Tooltip>
  );
}
