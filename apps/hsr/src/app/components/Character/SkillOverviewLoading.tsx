import { Loader2 } from "lucide-react";
import { Separator, Skeleton, Slider, Toggle } from "ui/primitive";

export function SkillOverviewLoading() {
  return (
    <div className="flex flex-col">
      <div className="flex h-fit flex-col sm:flex-row">
        <div className="grid grid-cols-4">
          {["Talent", "Skill", "Ultimate", "Technique"].map((name) => (
            <Toggle
              className="flex h-fit flex-col items-center px-1 py-1.5"
              key={name}
              pressed={name === "Talent"}
            >
              <Skeleton className="h-16 w-16 invert dark:invert-0" />
              <span className="self-center">{name}</span>
            </Toggle>
          ))}
        </div>

        <Separator className="my-3 sm:hidden" />

        <div className="flex w-full grow flex-col px-4 py-2 sm:w-auto">
          <h3 className="flex items-center justify-start text-lg font-semibold leading-none tracking-tight">
            <Loader2 className="mr-1 animate-spin" />
            Loading...
          </h3>
          <div className="flex items-center gap-4">
            <span className="whitespace-nowrap">Lv. 1</span>
            <Slider className="py-4" defaultValue={[0]} max={15} min={0} />
          </div>
        </div>
      </div>
    </div>
  );
}
