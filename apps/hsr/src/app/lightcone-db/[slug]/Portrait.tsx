"use client";

import useCardEffect from "@hsr/hooks/animation/useCardEffect";
import Image from "next/image";
import styles from "@hsr/css/floating-card.module.css";
import { img } from "@hsr/lib/utils";
import type { EquipmentConfig } from "@hsr/bindings/EquipmentConfig";
import { cn } from "lib";

interface Prop {
  data: EquipmentConfig;
}
export function Portrait({ data }: Prop) {
  const { flowRef, glowRef, removeListener, rotateToMouse } = useCardEffect();

  return (
    <div
      className={cn("relative h-fit w-full", styles.card)}
      onMouseLeave={removeListener}
      onMouseMove={rotateToMouse}
      ref={flowRef}
    >
      <Image
        alt={data.equipment_name}
        className="place-self-start object-contain"
        height={1260}
        src={img(`image/light_cone_portrait/${data.equipment_id}.png`)}
        width={902}
      />
      <div className={styles.glow} ref={glowRef} />
    </div>
  );
}
