import { ruleTester } from "tsl/ruleTester";
import { noLeakedConditionalRendering, messages } from "./noLeakedConditionalRendering.ts";
import { expect, test } from "vitest";

test("noLeakedConditionalRendering", () => {
  const ret = ruleTester({
    ruleFn: noLeakedConditionalRendering,
    valid: [
      // TODO: Add valid cases
    ],
    invalid: [
      // TODO: Add invalid cases
    ],
  });
  expect(ret).toEqual(false);
});
