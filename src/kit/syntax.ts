import type { AST } from "tsl";
import { SyntaxKind } from "typescript";

export function isLogicalNegationExpression(node: AST.AnyNode): node is AST.PrefixUnaryExpression {
  return node.kind === SyntaxKind.PrefixUnaryExpression && node.operator === SyntaxKind.ExclamationToken;
}
