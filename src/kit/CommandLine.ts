import { parseArgs } from "node:util";

export function getCommandLineOptions() {
  const { values } = parseArgs({
    options: { project: { type: "string", short: "p" } },
  });

  return values;
}
