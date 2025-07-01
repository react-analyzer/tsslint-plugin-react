// tsl.config.ts
import { hole } from "effect/Function";
import { isMatching, match, P } from "ts-pattern";
import { core, defineConfig, defineRule } from "tsl";
import { SyntaxKind } from "typescript";

const isNullOrUndefine = P.union(
  SyntaxKind.NullKeyword,
  SyntaxKind.UndefinedKeyword,
);

const isEqEqEqOrExEqEq = P.union(
  SyntaxKind.EqualsEqualsEqualsToken,
  SyntaxKind.ExclamationEqualsEqualsToken,
);

const preferEqEqNullishComparison = defineRule(() => ({
  name: "local/preferEqEqNullishComparison",
  visitor: {
    BinaryExpression(context, node) {
      if (!isMatching(isEqEqEqOrExEqEq, node.operatorToken.kind)) return;
      if (!isMatching(isNullOrUndefine, node.left.kind) && !isMatching(isNullOrUndefine, node.right.kind)) return;
      const newOperatorText = match(node.operatorToken.kind)
        .with(SyntaxKind.EqualsEqualsEqualsToken, () => "==")
        .with(SyntaxKind.ExclamationEqualsEqualsToken, () => "!=")
        .otherwise<never>(hole);
      context.report({
        message: "Use '==' or '!=' for nullish comparison.",
        node,
        suggestions: [
          {
            message: `Replace with '${newOperatorText}'`,
            changes: [
              {
                start: node.operatorToken.getStart(),
                end: node.operatorToken.getEnd(),
                newText: newOperatorText,
              },
            ],
          },
        ],
      });
    },
  },
}));

export default defineConfig({
  rules: [
    ...core.all(),
    core.strictBooleanExpressions({
      allowAny: false,
      allowNullableBoolean: false,
      allowNullableEnum: false,
      allowNullableNumber: false,
      allowNullableObject: false,
      allowNullableString: false,
      allowNumber: false,
      allowString: false,
    }),
    core.switchExhaustivenessCheck({
      considerDefaultExhaustiveForUnions: true,
    }),
    core.noConfusingVoidExpression("off"),
    preferEqEqNullishComparison(),
  ],
});
