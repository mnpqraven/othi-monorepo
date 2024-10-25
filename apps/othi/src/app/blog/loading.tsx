import { Button } from "ui/primitive";

export default function Loading() {
  return (
    <div className="flex flex-col gap-4">
      <Button
        className="w-full justify-between p-4 animate-pulse"
        variant="outline"
      >
        Loading...
      </Button>
    </div>
  );
}
