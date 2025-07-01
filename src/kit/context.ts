import { getTsconfig } from "get-tsconfig";
import { parseArgs } from "node:util";
import type { Context } from "tsl";

export interface ReactAnalyzerOptions {
  version: string;
}

export function getReactAnalyzerOptions(context: Omit<Context, "data">): ReactAnalyzerOptions {
  const { values } = parseArgs({
    options: { project: { type: "string", short: "p" } },
  });
  const tsconfig = getTsconfig(values.project ?? "tsconfig.json");
  return {
    version: "19.1.0",
    ...tsconfig?.config["react" as never] ?? {},
  };
}
