import { ruleTester } from "tsl/ruleTester";
import { expect, test } from "vitest";
import { noLeakedConditionalRendering } from "./noLeakedConditionalRendering.ts";

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
