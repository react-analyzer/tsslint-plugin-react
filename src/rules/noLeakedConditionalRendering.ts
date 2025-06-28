import { defineRule } from "tsl";

export const messages = {
  // dprint-ignore
  noLeakedConditionalRendering: (value: string) => `Potential leaked value ${value} that might cause unintentionally rendered values or rendering crashes.`,
};

export const noLeakedConditionalRendering = defineRule(() => ({
  name: "@react-analyzer/noLeakedConditionalRendering",
  visitor: {
    JsxExpression(context, node) {
      // TODO: Port the rule from https://github.com/Rel1cx/eslint-react/blob/2.0.0-beta/packages/plugins/eslint-plugin-react-x/src/rules/no-leaked-conditional-rendering.ts
    },
  },
}));
