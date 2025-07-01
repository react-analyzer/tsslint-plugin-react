import { compare } from "compare-versions";
import { defineRule, type AST, type ReportDescriptor } from "tsl";
import { SyntaxKind } from "typescript";

import { Check as CHK, Context as CTX, Report as RPT, Syntax } from "../kit/kit.ts";
import { unit } from "../lib/eff.ts";

export const RULE_NAME = "noLeakedConditionalRendering";

export const messages = {
  noLeakedConditionalRendering: (p: { value: string }) =>
    `Potential leaked value ${p.value} that might cause unintentionally rendered values or rendering crashes.`,
} as const;

// #region Rule Implementation

// TODO: Port the rule from https://github.com/Rel1cx/eslint-react/blob/2.0.0-beta/packages/plugins/eslint-plugin-react-x/src/rules/no-leaked-conditional-rendering.ts
export const noLeakedConditionalRendering = defineRule(() => {
  return {
    name: `@react-analyzer/${RULE_NAME}`,
    createData(context) {
      const { version } = CTX.getSettingsFromContext(context);

      // Allowed left node type variants
      const allowedVariants = [
        "any",
        "boolean",
        "nullish",
        "object",
        "falsy boolean",
        "truthy bigint",
        "truthy boolean",
        "truthy number",
        "truthy string",
        ...compare(version, "18.0.0", "<")
          ? []
          : ["string", "falsy string"] as const,
      ] as const satisfies CHK.Variant[];

      function getReportDescriptor(
        node:
          | unit
          | AST.Expression,
      ): ReportDescriptor | unit {
        if (node == null) return unit;
        switch (node.kind) {
          case SyntaxKind.JsxExpression:
          case SyntaxKind.AsExpression:
          case SyntaxKind.TypeAssertionExpression:
          case SyntaxKind.NonNullExpression:
          case SyntaxKind.SatisfiesExpression:
          case SyntaxKind.ExpressionWithTypeArguments: {
            return getReportDescriptor(node.expression);
          }
          case SyntaxKind.BinaryExpression: {
            if (node.operatorToken.kind !== SyntaxKind.AmpersandAmpersandToken) return unit;
            if (Syntax.isLogicalNegationExpression(node.left)) return getReportDescriptor(node.right);
            // TODO: Implement the rest of the logic
            return unit;
          }
            // TODO: Implement the rest of the logic
        }
        return unit;
      }

      return {
        version,
        allowedVariants,
        getReportDescriptor,
      };
    },
    visitor: {
      JsxExpression(context, node) {
        RPT
          .make(context)
          .send(context.data.getReportDescriptor(node));
      },
    },
  };
});

// #endregion
