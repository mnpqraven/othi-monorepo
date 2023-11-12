import API from "@hsr/server/typedEndpoints";
import { Portrait } from "./Portrait";
import { Content } from "./Content";
import { LightConeRanking } from "./LightConeRanking";

interface Prop {
  params: { slug: string };
}

export default async function LightConePage({ params }: Prop) {
  const lcId = parseInt(params.slug);
  const callLc = API.lightConeMetadata.get({ lcId });
  const callLcSkill = API.lightConeSkill.get({ lcId });

  const [lc, lcSkill] = await Promise.all([callLc, callLcSkill]);

  return (
    <>
      <div className="h-fit p-12 md:max-w-[50%]">
        <Portrait lightconeId={lc.equipment_id} name={lc.equipment_name} />
      </div>
      <div className="flex flex-col gap-4 md:max-w-[50%]">
        <Content
          lcId={lc.equipment_id}
          name={lc.equipment_name}
          skill={{
            name: lcSkill.skill_name,
            paramList: lcSkill.param_list,
            desc: lcSkill.skill_desc,
          }}
        />
        <LightConeRanking id={lcId} />
      </div>
    </>
  );
}
