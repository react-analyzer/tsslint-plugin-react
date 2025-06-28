import { ruleTester } from "tsl/ruleTester";
import { noLeakedConditionalRendering, messages } from "./noLeakedConditionalRendering.ts";

export const test = () =>
  ruleTester({
    ruleFn: noLeakedConditionalRendering,
    valid: [
      // TODO: Add valid cases
    ],
    invalid: [
      // TODO: Add invalid cases
    ],
  });
