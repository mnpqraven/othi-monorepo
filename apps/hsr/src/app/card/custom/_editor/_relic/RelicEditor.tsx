import type { PrimitiveAtom } from "jotai";
import { useAtom, useAtomValue } from "jotai";
import { focusAtom } from "jotai-optics";
import type { Property } from "@hsr/bindings/SkillTreeConfig";
import { img } from "@hsr/lib/utils";
import { useMemo } from "react";
import Image from "next/image";
import { useSubStatSpread } from "@hsr/hooks/queries/useSubStatSpread";
import { prettyProperty } from "@hsr/lib/propertyHelper";
import { selectAtom, splitAtom } from "jotai/utils";
import type { SubStatSchema } from "@hsr/hooks/useStatParser";
import type { RelicType } from "@hsr/bindings/RelicConfig";
import type { RelicInput } from "@hsr/app/card/_store/relic";
import { AlignHorizontalDistributeCenter } from "lucide-react";
import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  useToast,
} from "ui/primitive";
import { PropertySelect } from "../PropertySelect";
import { subStatOptions } from "./relicConfig";
import { SubstatSpreadConfig } from "./SubstatSpreadConfig";

export function RelicEditor({ atom }: { atom: PrimitiveAtom<RelicInput> }) {
  const setIdAtom = useMemo(
    () => selectAtom(atom, (optic) => optic.setId),
    [atom]
  );
  const propertyAtom = useMemo(
    () => selectAtom(atom, (optic) => optic.property),
    [atom]
  );
  const substatsAtom = useMemo(
    () => focusAtom(atom, (optic) => optic.prop("subStats")),
    [atom]
  );

  const relic = useAtomValue(atom);
  const setId = useAtomValue(setIdAtom);
  const property = useAtomValue(propertyAtom);
  const { data: spreadData } = useSubStatSpread();
  const { toast } = useToast();

  const [substats, setSubstats] = useAtom(substatsAtom);
  const splittedSubstatAtom = useAtomValue(splitAtom(substatsAtom));

  if (!setId || !spreadData) return null;

  const occupiedProperties: Property[] = property
    ? [property, ...substats.filter(Boolean).map((e) => e!.property)]
    : substats.filter(Boolean).map((e) => e!.property);

  function onSubStatSelect(prop: Property, index: number) {
    let value = 0;
    const spreadInfo = spreadData?.find((e) => e.property === prop);
    if (spreadInfo) {
      const { base_value, step_num, step_value } = spreadInfo;
      value = base_value + (step_value * step_num) / 2;
    }

    setSubstats((substats) =>
      substats.map((substat, i) => {
        if (i === index) return { property: prop, step: 1, value };
        return substat;
      })
    );
  }

  function warnProperty(prop: Property | undefined) {
    if (!prop) {
      toast({
        variant: "destructive",
        description: "Please select a substat with the selector on the left",
      });
    }
  }

  return (
    <div className="flex gap-2">
      <Image
        alt=""
        className="h-24 w-24"
        height={64}
        src={getRelicIcon(relic.type, setId)}
        width={64}
      />

      <div className="grid flex-1 grid-cols-2 gap-2">
        {splittedSubstatAtom.map((ssAtom, index) => (
          <div className="flex items-center gap-2" key={index}>
            <PropertySelect
              className="w-44"
              itemDisabled={(prop) => occupiedProperties.includes(prop)}
              onValueChange={(prop) => {
                onSubStatSelect(prop, index);
              }}
              options={subStatOptions.map((e) => e.option)}
              value={substats.at(index)?.property}
            />
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  className="px-2"
                  disabled={!substats.at(index)?.property}
                  variant="outline"
                >
                  <AlignHorizontalDistributeCenter />
                </Button>
              </PopoverTrigger>

              <PopoverContent asChild side="top">
                <SubstatSpreadConfig
                  atom={ssAtom}
                  setId={setId}
                  spreadData={spreadData}
                />
              </PopoverContent>
            </Popover>

            <ValueLabel atom={ssAtom} />
          </div>
        ))}
      </div>
    </div>
  );
}

function ValueLabel({
  atom,
}: {
  atom: PrimitiveAtom<SubStatSchema | undefined>;
}) {
  const value = useAtomValue(atom);
  if (!value) return null;
  return prettyProperty(value.property, value.value).prettyValue;
}

function getRelicIcon(type: RelicType, setId: number) {
  const suffix = () => {
    switch (type) {
      case "HEAD":
        return "_0";
      case "HAND":
        return "_1";
      case "BODY":
        return "_2";
      case "FOOT":
        return "_3";
      case "OBJECT":
        return "_0";
      case "NECK":
        return "_1";
    }
  };
  return img(`icon/relic/${setId}${suffix()}.png`);
}
