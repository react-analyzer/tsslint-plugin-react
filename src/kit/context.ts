import { getTsconfig } from "get-tsconfig";
import { parseArgs } from "node:util";
import type { Context } from "tsl";

export function getSettingsFromContext(context: Omit<Context<unknown>, "data">) {
  const { values } = parseArgs({
    options: { project: { type: "string", short: "p" } },
  });
  const tsconfig = getTsconfig(values.project ?? "tsconfig.json");
  return {
    version: "19.1.0",
    ...tsconfig?.config["react" as never] ?? {},
  };
}
