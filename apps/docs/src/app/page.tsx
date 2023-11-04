import { Button } from "ui/primitive/button";
import { HELLO } from "@docs/app/test";

export default function Page() {
  const test = HELLO;

  return (
    <main className="font-bold">
      hello docs <br />
      {test}
      <Button>hello</Button>
    </main>
  );
}
