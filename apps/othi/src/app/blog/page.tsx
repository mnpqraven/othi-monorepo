import { SudoGuard } from "@othi/components/SudoGuard";
import Link from "next/link";
import { Button } from "ui/primitive";
import { DemoUploadButton } from "./DemoUploadButton";

export default function Page() {
  return (
    <div>
      <span>blog list</span>

      <SudoGuard>
        <Link href="/blog/create">
          <Button>create</Button>
        </Link>
        <DemoUploadButton />
      </SudoGuard>
    </div>
  );
}
