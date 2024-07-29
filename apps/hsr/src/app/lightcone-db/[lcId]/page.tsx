import { trpcServer } from "protocol/trpc/react/server";
import { notFound } from "next/navigation";
import { Portrait } from "./Portrait";
import { Content } from "./Content";
import { LightConeRanking } from "./LightConeRanking";

interface Prop {
  params: { lcId: string };
}

export default async function LightConePage({ params }: Prop) {
  const lcId = parseInt(params.lcId);
  const lc = await trpcServer.honkai.lightCone.by({ lcId, withSkill: true });

  if (!lc) notFound();

  return (
    <>
      <div className="h-fit p-12 md:max-w-[50%]">
        <Portrait lightconeId={lc.id} name={lc.name} />
      </div>
      <div className="flex flex-col gap-4 md:max-w-[50%]">
        {lc.skill ? (
          <Content
            lcId={lc.id}
            name={lc.name}
            skill={{
              name: lc.skill.name,
              paramList: lc.skill.paramList,
              desc: lc.skill.desc,
            }}
          />
        ) : null}
        <LightConeRanking id={lcId} />
      </div>
    </>
  );
}
