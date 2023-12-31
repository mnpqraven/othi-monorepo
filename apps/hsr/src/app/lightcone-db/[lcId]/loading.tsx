import styles from "@hsr/css/floating-card.module.css";
import { cn } from "lib";
import { Card, CardHeader, CardTitle } from "ui/primitive";

export default function Loading() {
  return (
    <>
      <div className="w-full p-12 md:max-w-[50%]">
        <div className={cn("relative h-fit w-full", styles.card)}>
          <div className="aspect-[902/1260] h-full w-full place-self-start object-contain" />
        </div>
        <div className={styles.glow} />
      </div>

      <Card className="w-full md:max-w-[50%]">
        <CardHeader>
          <CardTitle>Skill</CardTitle>
        </CardHeader>
      </Card>
    </>
  );
}
