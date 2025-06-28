import { createRulesSet } from "tsl";
import { noLeakedConditionalRendering } from "./rules/noLeakedConditionalRendering.ts";

export const rules = createRulesSet({
  noLeakedConditionalRendering,
  // TODO: Port more rules from https://beta.eslint-react.xyz/docs/rules/overview
});
