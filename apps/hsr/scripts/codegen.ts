import * as fs from "fs/promises";
import * as path from "path";
import * as url from "url";
import { compile } from "json-schema-to-typescript";

// or just __dirname if running non-ES-Module Node
const dirname = path.dirname(url.fileURLToPath(import.meta.url));

function jsonFileToTS(outputFile: string): string {
  return outputFile.replace(".json", ".ts");
}

const fileExists = async (path: string) =>
  !!(await fs.stat(path).catch((_) => false));

async function main() {
  console.log("executing TS type codegen...");
  let schemasPath = path.join(dirname, "..", ".schemas");
  let schemaFiles = (await fs.readdir(schemasPath)).filter((x) =>
    x.endsWith(".json")
  );

  for (let filename of schemaFiles) {
    let compiledTypes = new Set();

    let filePath = path.join(schemasPath, filename);
    let schema = JSON.parse(await fs.readFile(filePath, { encoding: "utf-8" }));
    let compiled = await compile(schema, schema.title, {
      additionalProperties: false,
      bannerComment: "",
    });
    let eachType = compiled.split("export");
    for (let type of eachType) {
      if (!type) {
        // blank strings like CRs, whitespaces
        continue;
      }
      compiledTypes.add("export " + type.trim());
    }
    let output = Array.from(compiledTypes).join("\n\n");
    let outputPath = path.join(
      dirname,
      "..",
      "src",
      "bindings",
      jsonFileToTS(filename)
    );

    try {
      if (await fileExists(outputPath)) {
        let existing = await fs.readFile(outputPath, { encoding: "utf-8" }); // err if doesn't exist
        if (existing == output) {
          // Skip writing if it hasn't changed, so that we don't confuse any sort
          // of incremental builds. This check isn't ideal but the script runs
          // quickly enough and rarely enough that it doesn't matter.
          console.log(`Schema ${filename} is up to date`);
          continue;
        }
      }
    } catch (e) {
      // It's fine if there's no output from a previous run.
      // if (e.code !== "ENOENT") {
      //   throw e;
      // }
      throw e;
    }

    await fs.writeFile(outputPath, output);
    console.log(`Wrote Typescript types to ${outputPath}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
