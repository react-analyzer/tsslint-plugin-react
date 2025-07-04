import type { AST } from "tsl";
import { SyntaxKind } from "typescript";

export function isLogicalNegationExpression(node: AST.AnyNode): node is AST.PrefixUnaryExpression {
  return node.kind === SyntaxKind.PrefixUnaryExpression && node.operator === SyntaxKind.ExclamationToken;
}

// TODO: Port the rest of the ast methods from https://github.com/Rel1cx/eslint-react/tree/2.0.0-beta/packages/utilities/ast
