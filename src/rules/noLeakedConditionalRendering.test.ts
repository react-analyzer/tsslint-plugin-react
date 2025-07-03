import tsx from "dedent";
import { ruleTester } from "tsl/ruleTester";
import { expect, test } from "vitest";
import { messages, noLeakedConditionalRendering } from "./noLeakedConditionalRendering.ts";

// TODO: Port more tests from https://github.com/Rel1cx/eslint-react/blob/2.0.0-beta/packages/plugins/eslint-plugin-react-x/src/rules/no-leaked-conditional-rendering.spec.ts
test("noLeakedConditionalRendering", () => {
  const ret = ruleTester({
    tsx: true,
    ruleFn: noLeakedConditionalRendering,
    valid: [
      tsx`const a = <div>{null && <span>hello</span>}</div>;`,
      tsx`const a = <div>{undefined && <span>hello</span>}</div>;`,
      tsx`const a = <div>{true && <span>hello</span>}</div>;`,
      tsx`const a = <div>{false && <span>hello</span>}</div>;`,
      tsx`const a = <div>{'string' && <span>hello</span>}</div>;`,
      tsx`const a = <div>{1 && <span>hello</span>}</div>;`,
      tsx`const a = <div>{42 && <span>hello</span>}</div>;`,
      tsx`const a = <div>{42n && <span>hello</span>}</div>;`,
      tsx`const a = <>{{ foo: "bar" } && <span>hello</span>}</div>;`,
      tsx`const a = <>{"" && <Something />}</>;`, // This is valid in React 18+
      tsx`const left = null; const a = <div>{left && <span>hello</span>}</div>;`,
      tsx`const left = undefined; const a = <div>{left && <span>hello</span>}</div>;`,
      tsx`const left = true; const a = <div>{left && <span>hello</span>}</div>;`,
      tsx`const left = false; const a = <div>{left && <span>hello</span>}</div>;`,
      tsx`const left = "string"; const a = <div>{left && <span>hello</span>}</div>;`,
      tsx`const left = 1; const a = <div>{left && <span>hello</span>}</div>;`,
      tsx`const left = 42; const a = <div>{left && <span>hello</span>}</div>;`,
      tsx`const left = 42n; const a = <div>{left && <span>hello</span>}</div>;`,
      tsx`const left = { foo: "bar" }; const a = <div>{left && <span>hello</span>}</div>;`,
      tsx`const left = ""; const a = <div>{left && <span>hello</span>}</div>;`, // This is valid in React 18+
    ],
    invalid: [
      {
        code: tsx`const a = <div>{0 && <span>hello</span>}</div>;`,
        errors: [
          {
            message: messages.noLeakedConditionalRendering({ value: "0" }),
            line: 1,
          },
        ],
      },
      {
        code: tsx`const a = <div>{0n && <span>hello</span>}</div>;`,
        errors: [
          {
            message: messages.noLeakedConditionalRendering({ value: "0n" }),
            line: 1,
          },
        ],
      },
      {
        code: tsx`const a = <div>{NaN && <span>hello</span>}</div>;`,
        errors: [
          {
            message: messages.noLeakedConditionalRendering({ value: "NaN" }),
            line: 1,
          },
        ],
      },
      {
        code: tsx`const a = <>{NaN && <Something />}</>;`,
        errors: [
          {
            message: messages.noLeakedConditionalRendering({ value: "NaN" }),
            line: 1,
          },
        ],
      },
      {
        code: tsx`const a = <>{ NaN && 0 && <Something /> }</>;`,
        errors: [
          {
            message: messages.noLeakedConditionalRendering({ value: "NaN && 0" }),
            line: 1,
          },
          {
            message: messages.noLeakedConditionalRendering({ value: "NaN" }),
            line: 1,
          },
        ],
      },
      {
        code: tsx`const a = <>{ NaN && 0 && 0n && <Something /> }</>;`,
        errors: [
          {
            message: messages.noLeakedConditionalRendering({ value: "NaN && 0 && 0n" }),
            line: 1,
          },
          {
            message: messages.noLeakedConditionalRendering({ value: "NaN && 0" }),
            line: 1,
          },
          {
            message: messages.noLeakedConditionalRendering({ value: "NaN" }),
            line: 1,
          },
        ],
      },
      {
        code: tsx`const left = 0; const a = <div>{left && <span>hello</span>}</div>;`,
        errors: [
          {
            message: messages.noLeakedConditionalRendering({ value: "left" }),
            line: 1,
          },
        ],
      },
      {
        code: tsx`const left = 0n; const a = <div>{left && <span>hello</span>}</div>;`,
        errors: [
          {
            message: messages.noLeakedConditionalRendering({ value: "left" }),
            line: 1,
          },
        ],
      },
    ],
  });
  expect(ret).toEqual(false);
});
