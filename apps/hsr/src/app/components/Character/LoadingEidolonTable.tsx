import { Badge, Skeleton, Toggle } from "ui/primitive";

export function LoadingEidolonTable() {
  return (
    <>
      <Row keys={[1, 2, 3]} />
      <div className="my-2 min-h-[8rem] whitespace-pre-wrap rounded-md border p-4" />
      <Row keys={[6, 5, 4]} />
    </>
  );
}

function Row({ keys }: { keys: number[] }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {keys.map((key) => (
        <Toggle
          className="flex h-full flex-1 flex-col justify-start gap-2 py-2 sm:flex-row"
          key={key}
          pressed={key === 1}
        >
          <div className="flex flex-col items-center gap-1">
            <Skeleton className="h-16 w-16 rounded-full" />
            <Badge className="w-fit sm:inline">E{key}</Badge>
          </div>
          <span className="md:text-lg"> </span>
        </Toggle>
      ))}
    </div>
  );
}
