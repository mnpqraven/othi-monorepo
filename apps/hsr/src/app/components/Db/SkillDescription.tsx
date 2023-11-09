import type { ParameterizedDescription } from "@hsr/bindings/SkillTreeConfig";
import { sanitizeNewline } from "lib/utils";
import { Fragment } from "react";

interface SkillDescriptionProps {
  skillDesc: ParameterizedDescription;
  paramList: string[][] | string[];
  /**
   * slv/imposition value
   *
   * NOTE: this is 0-based, beware
   */
  slv: number;
}

export function SkillDescription({
  skillDesc,
  paramList,
  slv,
}: SkillDescriptionProps) {
  // for depth of 2, flatten once
  const currentParam = Array.isArray(paramList[0]) ? paramList[slv] : paramList;

  return (
    <p className="text-justify">
      {skillDesc.map((descPart, index) => (
        <Fragment key={index}>
          <span className="whitespace-pre-wrap">
            {sanitizeNewline(descPart)}
          </span>
          <span className="text-accent-foreground font-semibold">
            {currentParam ? currentParam[index] : null}
          </span>
        </Fragment>
      ))}
    </p>
  );
}
