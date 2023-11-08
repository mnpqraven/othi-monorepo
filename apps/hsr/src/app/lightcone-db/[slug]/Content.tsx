"use client";

import { SkillDescription } from "@hsr/app/components/Db/SkillDescription";
import type { EquipmentConfig } from "@hsr/bindings/EquipmentConfig";
import type { EquipmentSkillConfig } from "@hsr/bindings/EquipmentSkillConfig";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Slider,
} from "ui/primitive";

interface Prop {
  data: EquipmentConfig;
  skill: EquipmentSkillConfig | undefined;
  link?: boolean;
}
function Content({ data, skill, link = false }: Prop) {
  const [promotion, setPromotion] = useState(0);

  return (
    <div className="flex flex-col gap-4">
      <Card className="flex-1">
        <div className="flex items-center justify-between">
          <CardHeader>
            <CardTitle>
              {link ? (
                <Link
                  className="flex items-center hover:underline"
                  href={`/lightcone-db/${data.equipment_id}`}
                >
                  {data.equipment_name}
                  <ExternalLink className="ml-1 h-4 w-4" />
                </Link>
              ) : (
                <span>{data.equipment_name}</span>
              )}
            </CardTitle>
            <CardDescription>{skill?.skill_name}</CardDescription>
          </CardHeader>

          <CardHeader>
            <CardTitle className="w-32">
              <Slider
                className="my-1.5"
                max={4}
                min={0}
                onValueChange={(e) => {
                  if (e[0]) setPromotion(e[0]);
                }}
              />
            </CardTitle>
            <CardDescription>Superimpose {promotion + 1}</CardDescription>
          </CardHeader>
        </div>
        <CardContent>
          {skill ? (
            <SkillDescription
              paramList={skill.param_list}
              skillDesc={skill.skill_desc}
              slv={promotion}
            />
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
export { Content };
