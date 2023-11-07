/* eslint-disable no-await-in-loop */
/* eslint-disable no-console */
import * as fs from "node:fs/promises";
import * as path from "node:path";
import * as url from "node:url";
import { compile } from "json-schema-to-typescript";

// or just __dirname if running non-ES-Module Node
const dirname = path.dirname(url.fileURLToPath(import.meta.url));

function jsonFileToTS(outputFile: string): string {
  return outputFile.replace(".json", ".ts");
}

const fileExists = async (path: string) =>
  Boolean(await fs.stat(path).catch((_) => false));

async function main() {
  console.log("executing TS type codegen...");
  const schemasPath = path.join(dirname, "..", ".schemas");
  const schemaFiles = (await fs.readdir(schemasPath)).filter((x) =>
    x.endsWith(".json")
  );

  for (const filename of schemaFiles) {
    const compiledTypes = new Set();

    const filePath = path.join(schemasPath, filename);
    const schema = JSON.parse(
      await fs.readFile(filePath, { encoding: "utf-8" })
    );
    const compiled = await compile(schema, schema.title, {
      additionalProperties: false,
      bannerComment: "",
    });
    const eachType = compiled.split("export");
    for (const type of eachType) {
      if (!type) {
        // blank strings like CRs, whitespaces
        continue;
      }
      compiledTypes.add(`export ${type.trim()}`);
    }
    const output = Array.from(compiledTypes).join("\n\n");
    const outputPath = path.join(
      dirname,
      "..",
      "src",
      "bindings",
      jsonFileToTS(filename)
    );

    if (await fileExists(outputPath)) {
      const existing = await fs.readFile(outputPath, { encoding: "utf-8" }); // err if doesn't exist
      if (existing === output) {
        // Skip writing if it hasn't changed, so that we don't confuse any sort
        // of incremental builds. This check isn't ideal but the script runs
        // quickly enough and rarely enough that it doesn't matter.
        console.log(`Schema ${filename} is up to date`);
        continue;
      }
    }

    await fs.writeFile(outputPath, output);
    console.log(`Wrote Typescript types to ${outputPath}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
