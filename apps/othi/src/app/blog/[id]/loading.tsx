import { MoveLeft } from "lucide-react";
import Link from "next/link";
import { Separator } from "ui/primitive";

export default function Loading() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <Link
          className="flex gap-2 items-center hover:underline text-muted-foreground"
          href="/blog"
        >
          <MoveLeft className="h-4 w-4" />
          Back
        </Link>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-2xl font-semibold capitalize">Loading...</span>

        <span className="text-muted-foreground text-sm">Published at</span>
      </div>

      <Separator />
    </div>
  );
}
