import { compare } from "compare-versions";
import { defineRule, type AST, type ReportDescriptor } from "tsl";
import { SyntaxKind } from "typescript";

import { getAnalyzerOptions } from "../analyzer/analyzer.ts";
import * as CHK from "../checker/checker.ts";
import { isLogicalNegationExpression } from "../ast/ast.ts";
import { unit } from "../eff/eff.ts";
import { Report as RPT } from "../kit/kit.ts";

/** @internal */
export const messages = {
  noLeakedConditionalRendering: (p: { value: string }) =>
    `Potential leaked value ${p.value} that might cause unintentionally rendered values or rendering crashes.`,
} as const;

export const noLeakedConditionalRendering = defineRule(() => {
  return {
    name: "@react-analyzer/noLeakedConditionalRendering",
    createData(ctx) {
      const { version } = getAnalyzerOptions(ctx);
      const state = {
        isWithinJsxExpression: false,
      };

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

      function getReportDescriptor(node: AST.BinaryExpression): ReportDescriptor | unit {
        // If the left node is a logical negation expression, we skip the type check for better performance
        if (isLogicalNegationExpression(node.left)) return unit;
        const leftType = ctx.utils.getConstrainedTypeAtLocation(node.left);
        const leftTypeVariants = CHK.getVariantsOfTypes(ctx.utils.unionConstituents(leftType));
        const isLeftTypeValid = Array
          .from(leftTypeVariants.values())
          .every((type) => allowedVariants.some((allowed) => allowed === type));
        if (!isLeftTypeValid) {
          return {
            node: node.left,
            message: messages.noLeakedConditionalRendering({ value: node.left.getText() }),
          };
        }
        return unit;
      }

      return { state, version, allowedVariants, getReportDescriptor } as const;
    },
    visitor: {
      JsxExpression(ctx) {
        ctx.data.state.isWithinJsxExpression = true;
      },
      JsxExpression_exit(ctx) {
        ctx.data.state.isWithinJsxExpression = false;
      },
      BinaryExpression(ctx, node) {
        const { state, getReportDescriptor } = ctx.data;
        if (!state.isWithinJsxExpression) return;
        if (node.operatorToken.kind !== SyntaxKind.AmpersandAmpersandToken) return;
        RPT.report(ctx, getReportDescriptor(node));
      },
    },
  };
});
