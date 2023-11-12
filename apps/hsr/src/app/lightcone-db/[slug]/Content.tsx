"use client";

import { SkillDescription } from "@hsr/app/components/Db/SkillDescription";
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
  lcId: string | number;
  name: string | null;
  skill?: {
    name: string | null;
    paramList: string[][] | null;
    desc: string[] | null;
  };
  link?: boolean;
}
function Content({ lcId, name, skill, link = false }: Prop) {
  const [promotion, setPromotion] = useState(0);

  return (
    <div className="flex flex-col gap-4">
      <Card className="flex-1">
        <div className="flex items-center justify-between">
          <CardHeader>
            <CardTitle>
              {link ? (
                <Link
                  className="hover:underline"
                  href={`/lightcone-db/${lcId}`}
                >
                  {name}
                  <ExternalLink className="inline ml-1 h-4 w-4" />
                </Link>
              ) : (
                <span>{name}</span>
              )}
            </CardTitle>
            <CardDescription>{skill?.name}</CardDescription>
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
              paramList={skill.paramList ?? []}
              skillDesc={skill.desc ?? []}
              slv={promotion}
            />
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
export { Content };
