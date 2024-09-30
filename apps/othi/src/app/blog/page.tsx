import { SudoGuard } from "@othi/components/SudoGuard";
import Link from "next/link";
import { Button } from "ui/primitive";
import { BlogList } from "./BlogList";

export default function Page() {
  return (
    <div className="flex flex-col gap-4">
      <SudoGuard>
        <div className="flex items-center justify-end">
          <Link href="/blog/editor">
            <Button>New</Button>
          </Link>
        </div>
      </SudoGuard>

      <BlogList />
    </div>
  );
}
