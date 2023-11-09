import type { Property } from "@hsr/bindings/RelicMainAffixConfig";
import { isPropertyPercent, prettyProperty } from "@hsr/lib/propertyHelper";
import type { PrimitiveAtom } from "jotai";
import { atom, useAtom, useAtomValue } from "jotai";
import { splitAtom } from "jotai/utils";
import { Check, Pencil } from "lucide-react";
import type { HTMLAttributes } from "react";
import { forwardRef, useEffect, useMemo, useState } from "react";
import type { SubStatSchema } from "@hsr/hooks/useStatParser";
import type { RelicSubAffixConfig } from "@hsr/bindings/RelicSubAffixConfig";
import { asPercentage, cn, range } from "lib";
import { Button, Input, Toggle } from "ui/primitive";
import { SpreadConfigBar } from "./SpreadConfigBar";

interface Prop extends HTMLAttributes<HTMLDivElement> {
  atom: PrimitiveAtom<SubStatSchema | undefined>;
  setId: number | undefined;
  spreadData: RelicSubAffixConfig[];
}

const SubstatSpreadConfig = forwardRef<HTMLDivElement, Prop>(
  ({ atom: atomm, spreadData, setId, className, ...props }, ref) => {
    // should only set this in 2 spots, once on input checkbox, once on roll buttons
    const value = useAtomValue(atomm);
    const [message, setMessage] = useState<string | undefined>(undefined);
    const spreadInfo = spreadData.find((e) => e.property === value?.property);
    const defaultSpreadRolls = useMemo(
      () =>
        calculateSpread({
          spreadData: spreadInfo!,
          value: value?.value,
        }).rolls,
      [spreadInfo, value?.value]
    );
    const spreadLocalAtom = useMemo(
      () =>
        atom(defaultSpreadRolls, (get, set, next: number[]) => {
          set(spreadLocalAtom, next);
          const got = get(atomm);
          if (got) {
            set(atomm, {
              property: got.property,
              step: next.filter((e) => e > 0).length,
              value: next.reduce((a, b) => a + b, 0),
            });
          }
        }),
      [atomm, defaultSpreadRolls]
    );
    const spreadSplittedLocalAtom = useMemo(
      () => splitAtom(spreadLocalAtom),
      [spreadLocalAtom]
    );
    const [readOnlySpread, setSpread] = useAtom(spreadLocalAtom);
    const spreadAtoms = useAtomValue(spreadSplittedLocalAtom);
    const [valueAsString, setValueAsString] = useState({
      text: getDefaultTextValue(value?.value, value?.property),
      percent: false,
    });

    const [disabled, setDisabled] = useState(true);

    // set initial data for the value input box
    useEffect(() => {
      if (value?.property) {
        const percent = isPropertyPercent(value.property);
        setValueAsString({
          text: (value.value * (percent ? 100 : 1)).toFixed(2),
          percent,
        });
      }
    }, [value]);

    if (!spreadInfo || !value?.property || !setId) return null;

    const { minRoll, midRoll, maxRoll } = getSpreadValues(spreadInfo);

    const spreadTable = [
      { label: "Low Roll", value: minRoll.display },
      { label: "Normal Roll", value: midRoll.display },
      { label: "High Roll", value: maxRoll.display },
    ];

    const onUserInputChange = (textValue: string) => {
      const parsed = Number(textValue);
      if (!Number.isNaN(parsed)) {
        setValueAsString(({ percent }) => ({ percent, text: textValue }));
      }
    };

    const onUserInputConfirm = () => {
      const parsed = valueAsString.percent
        ? Number(valueAsString.text) / 100
        : Number(valueAsString.text);
      const { valid, message, rolls } = calculateSpread({
        spreadData: spreadInfo,
        value: parsed,
      });
      setMessage(message);

      if (valid) {
        setSpread(rolls);
        setDisabled(!disabled);
      }
    };

    return (
      <div
        className={cn(className, "flex w-96 flex-col gap-2")}
        ref={ref}
        {...props}
      >
        <div className="flex gap-2 rounded-md border" id="table">
          {spreadTable.map(({ label, value }) => (
            <div className="flex grow flex-col items-center p-1" key={label}>
              <span>{label}</span>
              <span>{value} </span>
            </div>
          ))}
        </div>

        {/* spread buttons */}
        <div className="flex items-center justify-center gap-2" id="edit-row">
          {!disabled ? (
            <Input
              className="w-20"
              disabled={disabled}
              onChange={(e) => {
                onUserInputChange(e.target.value);
              }}
              value={valueAsString.text}
            />
          ) : (
            <div>
              {getSumValue(readOnlySpread, isPropertyPercent(value.property))}
            </div>
          )}
          {isPropertyPercent(value.property) && "%"}
          <Toggle
            className="px-2"
            onPressedChange={(e) => {
              setDisabled(!e);
            }}
            pressed={!disabled}
          >
            <Pencil className="cursor-pointer" />
          </Toggle>

          {!disabled && (
            <Button
              className="bg-green-700 px-2 hover:bg-green-700/90"
              onClick={onUserInputConfirm}
            >
              <Check />
            </Button>
          )}
        </div>

        <div className="text-destructive text-center">{message}</div>

        <div className="flex justify-center" id="setters">
          {spreadAtoms.map((atom, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <SpreadConfigBar atom={atom} key={index} spreadInfo={spreadInfo} />
          ))}
        </div>
      </div>
    );
  }
);
SubstatSpreadConfig.displayName = "RelicSpreadConfig";

function getSumValue(numbers: number[], isPercent: boolean) {
  const sum = numbers.reduce((a, b) => a + b, 0);
  return (sum * (isPercent ? 100 : 1)).toFixed(2);
}

export { SubstatSpreadConfig };

function getDefaultTextValue(
  value: number | undefined,
  prop: Property | undefined
) {
  if (!value || !prop) return "";
  if (isPropertyPercent(prop)) return (value * 100).toFixed(2);
  return value.toFixed(2);
}

/**
 * take the substat value and return the corresponding spread values
 */
export function calculateSpread({
  value,
  spreadData: spread,
}: {
  value: number | undefined;
  spreadData: RelicSubAffixConfig;
}): { valid: boolean; rolls: number[]; message?: string } {
  const { property } = spread;

  // 5% correction
  const absMin = getSpreadValues(spread).minRoll.value * 0.95;
  const absMax = getSpreadValues(spread).maxRoll.value * 1.05;

  if (!value)
    return {
      valid: false,
      rolls: Array.from(range(0, 5)).fill(0),
      message: "Value is empty",
    };

  // calculates how many rolls would it take for @params value
  let approxRolls = 0;
  const dummyVal = { min: 0, max: 0 };
  while (value > dummyVal.max) {
    approxRolls += 1;
    dummyVal.max += absMax;
    dummyVal.min += absMin;
    if (value >= dummyVal.min && value <= dummyVal.max) break;
  }

  if (approxRolls > 6)
    return {
      valid: false,
      rolls: Array.from(range(0, 5)).fill(0),
      message: `Please enter value between ${
        prettyProperty(property, Number(absMin)).prettyValue
      } and ${prettyProperty(property, absMax * 6).prettyValue}`,
    };

  // INFO: top down strategy
  const toUpdate: number[] = [];
  let tempVal = value;
  while (tempVal > 0) {
    const maxRoll = getSpreadValues(spread).maxRoll.value;
    toUpdate.push(tempVal >= maxRoll ? maxRoll : tempVal);
    tempVal -= maxRoll;
  }

  // see if top down strategy is valid
  const isValid = toUpdate.at(-1) ? toUpdate.at(-1)! >= absMin : false;

  if (isValid)
    return {
      valid: true,
      rolls: Array.from(range(0, 5)).map((i) => toUpdate.at(i) ?? 0),
    };

  // even strategy
  const mean = value / approxRolls;
  const rolls = Array.from({ length: 6 }).map((_, i) =>
    i < approxRolls ? mean : 0
  );
  const valid = rolls
    .filter((num) => num !== 0)
    .every((num) => num <= absMax && num >= absMin);

  return {
    valid,
    rolls,
    message: valid
      ? undefined
      : `Please enter value between ${
          prettyProperty(property, absMin * approxRolls).prettyValue
        } and ${prettyProperty(property, absMax * approxRolls).prettyValue}`,
  };
}

function getSpreadValues({
  step_value,
  step_num,
  base_value,
  property,
}: RelicSubAffixConfig) {
  const minRoll = base_value;
  const midRoll = base_value + (step_value * step_num) / 2;
  const maxRoll = base_value + step_value * step_num;

  const withPercent = (val: number) =>
    isPropertyPercent(property) ? asPercentage(val) : val.toFixed(2);

  return {
    minRoll: { value: minRoll, display: withPercent(minRoll) },
    midRoll: { value: midRoll, display: withPercent(midRoll) },
    maxRoll: { value: maxRoll, display: withPercent(maxRoll) },
  };
}
