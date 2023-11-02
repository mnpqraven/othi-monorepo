import { env } from "../env.mjs";
import { Card } from "ui";
import { HELLO } from "@docs/app/test";

export default function Page() {
  const test = HELLO;

  return (
    <main className="font-bold">
      hello docs <br />
      {env.SECRET} {test}
      <Card title="hi" href="/">
        hello
      </Card>
    </main>
  );
}
