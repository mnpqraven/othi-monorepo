"use client";

import { useForm } from "react-hook-form";
import { range } from "lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useDebounce } from "@hsr/hooks/useDebounce";
import { useEffect, useMemo, useState } from "react";
import { useFuturePatchDateList } from "@hsr/hooks/queries/useFuturePatchDate";
import equal from "fast-deep-equal/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCacheValidate } from "@hsr/hooks/useCacheValidate";
import { useAtom } from "jotai";
import type { JadeEstimateCfg } from "protocol/ts";
import { EqTier, Server } from "protocol/ts";
import type { PartialMessage } from "@bufbuild/protobuf";
import {
  Button,
  Calendar,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
} from "ui/primitive";
import { cn } from "lib";
import type { Patch } from "../../../bindings/Patch";
import {
  defaultValues,
  estimateFormAtom,
  selectedCalendarDateAtom,
  selectedMonthAtom,
} from "../_store/main";
import { dateToISO, objToDate } from "../../components/schemas";
import { schema } from "./schema";
import { BattlePassField } from "./BattlePassField";
import { RailPassField } from "./RailPassField";
import { CurrentRollTab } from "./CurrentRollTab";
import { CalendarFooter } from "./CalendarFooter";

interface Prop {
  submitButton?: boolean;
}

type FormSchema = PartialMessage<JadeEstimateCfg>;

export default function JadeEstimateForm({ submitButton = false }: Prop) {
  const [open, setOpen] = useState(false);
  const [beforeFirstRender, setBeforeFirstRender] = useState(true);
  // INFO: month marker on calendar
  const [selectedCalendarDate, setSelectedCalendarDate] = useAtom(
    selectedCalendarDateAtom
  );

  const [monthController, setMonthController] = useAtom(selectedMonthAtom);

  // INFO: localStorage managed by Jotai store
  const [storagedForm, setStoragedForm] = useAtom(estimateFormAtom);

  // INFO: FORM SETUP
  const form = useForm<JadeEstimateCfg>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const debounceOnChange = useDebounce(form.handleSubmit(onSubmit), 300);

  const server = form.watch("server"); // 0 asia 1 america
  const { futurePatchDateList: binding } = useFuturePatchDateList();
  const futurePatchDateList = useMemo(
    () => getPatchDates(binding, server),
    [binding, server]
  );

  useCacheValidate({
    schema,
    schemaData: storagedForm,
    onReload: () => {
      setStoragedForm(defaultValues);
      form.reset(defaultValues);
    },
  });

  useEffect(() => {
    if (beforeFirstRender && !equal(storagedForm, defaultValues)) {
      form.reset(storagedForm);
      setBeforeFirstRender(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storagedForm]);

  function onSubmit(values: FormSchema) {
    // NOTE: this deep check is important
    if (!equal(values, defaultValues) && !equal(values, storagedForm)) {
      setStoragedForm(values);
    }
  }

  function onSelectDatePreset(date: string | number) {
    const d = new Date(date);
    setSelectedCalendarDate(d);
    setMonthController(d);
    setOpen(false);
  }

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "c" && (e.altKey || e.metaKey)) {
        setOpen((prev) => !prev);
      }
    };

    document.addEventListener("keydown", down);
    return () => {
      document.removeEventListener("keydown", down);
    };
  }, []);

  return (
    <Form {...form}>
      <form className="space-y-4" onChange={debounceOnChange}>
        <FormField
          control={form.control}
          name="untilDate"
          render={({ field: dateField }) => (
            <FormItem className="flex flex-col">
              <div className="flex items-center space-x-4 rounded-md border p-4">
                <div className="flex-1 space-y-1">
                  <FormLabel>Goal Date</FormLabel>
                  <FormDescription>The date that you will pull</FormDescription>
                  <FormMessage />
                </div>
                <div className="flex flex-col gap-4 lg:flex-row">
                  <FormField
                    control={form.control}
                    name="server"
                    render={({ field: serverField }) => (
                      <FormItem>
                        <Select
                          onValueChange={(data) => {
                            const asInt = parseInt(data);
                            serverField.onChange(asInt);
                          }}
                          value={String(serverField.value)}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value={String(Server.Asia)}>
                              {Server[Server.Asia]}
                            </SelectItem>
                            <SelectItem value={String(Server.America)}>
                              {Server[Server.America]}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          className={cn(
                            "min-w-[208px] justify-between pl-3 text-left font-normal",
                            !dateField.value && "text-muted-foreground"
                          )}
                          variant="outline"
                        >
                          {dateField.value ? (
                            format(objToDate.parse(dateField.value), "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent
                      align="start"
                      className="flex w-auto flex-col space-y-2 p-2"
                    >
                      <Button
                        className="justify-between"
                        onClick={() => {
                          setOpen(true);
                        }}
                        variant="outline"
                      >
                        <span>Jump to ...</span>
                        <kbd className="bg-muted text-muted-foreground pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100">
                          <span className="text-xs">⌘/Alt + C</span>
                        </kbd>
                      </Button>
                      <CommandDialog onOpenChange={setOpen} open={open}>
                        <CommandInput placeholder="Click on a result or search..." />
                        <CommandList>
                          <CommandEmpty>No results found.</CommandEmpty>
                          <CommandGroup>
                            <CommandItem
                              onSelect={() => {
                                onSelectDatePreset(Date.now());
                              }}
                            >
                              Today
                            </CommandItem>
                            {futurePatchDateList.map((e) => (
                              <CommandItem
                                key={e.version}
                                onSelect={() => {
                                  onSelectDatePreset(e.dateStart);
                                }}
                              >
                                {e.name} - {new Date(e.dateStart).getUTCDate()}/
                                {new Date(e.dateStart).getUTCMonth() + 1}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </CommandDialog>

                      <Calendar
                        className="py-0"
                        disabled={beforeToday}
                        footer={<CalendarFooter date={selectedCalendarDate} />}
                        initialFocus
                        mode="single"
                        modifiers={{
                          patchStart: futurePatchDateList.map(
                            (e) => new Date(e.dateStart)
                          ),
                          patchBanner: futurePatchDateList
                            .map((e) => new Date(e.dateStart))
                            .concat(
                              futurePatchDateList.map(
                                (e) => new Date(e.date2ndBanner)
                              )
                            ),
                        }}
                        modifiersStyles={{
                          patchStart: {
                            fontWeight: "bold",
                            border: "1px dashed green",
                          },
                          patchBanner: {
                            fontWeight: "bold",
                            textDecorationLine: "underline",
                            textUnderlinePosition: "under",
                          },
                        }}
                        month={monthController}
                        onMonthChange={setMonthController}
                        onSelect={(e) => {
                          if (e) {
                            setSelectedCalendarDate(e);
                            dateField.onChange(dateToISO.parse(e));
                          }
                        }}
                        selected={selectedCalendarDate}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </FormItem>
          )}
        />
        <RailPassField form={form} />
        <BattlePassField form={form} />
        <FormField
          control={form.control}
          name="eq"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center space-x-4 rounded-md border p-4">
                <div className="flex-1 space-y-1">
                  <FormLabel>Equilibrum Level</FormLabel>
                  <FormDescription>
                    You get more rewards the higher your Equilibrum level is
                  </FormDescription>
                </div>
                <Select
                  onValueChange={(data) => {
                    const asInt = parseInt(data);
                    field.onChange(asInt);
                  }}
                  value={String(field.value)}
                >
                  <FormControl>
                    <SelectTrigger className="w-fit">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {tbLevels.map(({ value, label }) => (
                      <SelectItem key={value} value={String(value)}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="moc"
            render={({ field }) => (
              <FormItem>
                <div className="flex h-full space-x-4 rounded-md border p-4">
                  <div className="flex-1 space-y-1">
                    <FormLabel>Memory of Chaos</FormLabel>
                    <FormDescription>
                      Amount of stars you can clear in a MoC cycle
                    </FormDescription>
                  </div>
                  <Select
                    defaultValue={String(field.value)}
                    onValueChange={(e) => {
                      field.onChange(Number(e));
                    }}
                    value={String(form.watch("moc"))}
                  >
                    <FormControl>
                      <SelectTrigger className="w-fit place-self-center">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {mocStars().map((value) => (
                        <SelectItem key={value} value={String(value)}>
                          {value} ✦
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="mocCurrentWeekDone"
            render={({ field }) => (
              <FormItem>
                <div className="flex h-full space-x-4 rounded-md border p-4">
                  <div className="flex-1 space-y-1">
                    <FormLabel>Current Cycle Completed</FormLabel>
                    <FormDescription>
                      Whether you have completed the current MoC cycle
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      className="place-self-center"
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </div>
              </FormItem>
            )}
          />
        </div>
        <CurrentRollTab form={form} />
        {submitButton ? <Button type="submit">Calculate</Button> : null}
      </form>
    </Form>
  );
}

const tbLevels = [
  { value: EqTier.Zero, label: "0 (TL 20-)" },
  { value: EqTier.One, label: "1 (TL 20+)" },
  { value: EqTier.Two, label: "2 (TL 30+)" },
  { value: EqTier.Three, label: "3 (TL 40+)" },
  { value: EqTier.Four, label: "4 (TL 50+)" },
  { value: EqTier.Five, label: "5 (TL 60+)" },
  { value: EqTier.Six, label: "6 (TL 65+)" },
];

function getPatchDates(patches: Patch[], server: Server) {
  const diff = 10 * 60 * 60 * 1000; // h m s ms
  if (server === Server.Asia) return patches;
  return patches.map((e) => ({
    ...e,
    date2ndBanner: new Date(
      new Date(e.date2ndBanner).getTime() + diff
    ).toISOString(),
    dateEnd: new Date(new Date(e.dateEnd).getTime() + diff).toISOString(),
    dateStart: new Date(new Date(e.dateStart).getTime() + diff).toISOString(),
  }));
}

function beforeToday(date: Date): boolean {
  const b = new Date();
  b.setHours(0);
  b.setMinutes(0);
  b.setSeconds(0);
  b.setMilliseconds(0);
  return date < b;
}

function mocStars(): number[] {
  return Array.from(range(0, 30, 3));
}
