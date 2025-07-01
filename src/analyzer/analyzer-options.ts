import { getTsconfig } from "get-tsconfig";
import { match, P } from "ts-pattern";
import type { Context } from "tsl";

import { identity } from "../lib/eff.ts";
import { getCommandLineOptions } from "../helper.ts";

export interface AnalyzerOptions {
  version: string;
}

export const defaultAnalyzerOptions = {
  version: "19.1.0",
} as const satisfies AnalyzerOptions;

// TODO: Port the rest of the options from https://github.com/Rel1cx/eslint-react/blob/2.0.0-beta/packages/shared/src/settings.ts
export function getAnalyzerOptions(context: Omit<Context, "data">): AnalyzerOptions {
  const { project = "tsconfig.json" } = getCommandLineOptions();
  // TODO: Improve the type handling here
  const options = getTsconfig(project)?.config["react" as never] as unknown;
  return {
    ...defaultAnalyzerOptions,
    ...match(options)
      .with({ version: P.string }, identity)
      .otherwise(() => ({})),
  };
}
