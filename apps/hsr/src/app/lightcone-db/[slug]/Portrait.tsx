"use client";

import useCardEffect from "@hsr/hooks/animation/useCardEffect";
import Image from "next/image";
import styles from "@hsr/css/floating-card.module.css";
import { img } from "@hsr/lib/utils";
import { EquipmentConfig } from "@hsr/bindings/EquipmentConfig";
import { cn } from "lib";

type Props = {
  data: EquipmentConfig;
};
export function Portrait({ data }: Props) {
  const { flowRef, glowRef, removeListener, rotateToMouse } = useCardEffect();

  return (
    <div
      ref={flowRef}
      className={cn("relative h-fit w-full", styles["card"])}
      onMouseLeave={removeListener}
      onMouseMove={rotateToMouse}
    >
      <Image
        src={img(`image/light_cone_portrait/${data.equipment_id}.png`)}
        width={902}
        height={1260}
        className="place-self-start object-contain"
        alt={data.equipment_name}
      />
      <div ref={glowRef} className={styles["glow"]} />
    </div>
  );
}
