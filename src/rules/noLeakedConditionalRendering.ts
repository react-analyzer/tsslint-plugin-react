import { compare } from "compare-versions";
import { isFalseLiteralType, isTrueLiteralType, isTypeFlagSet } from "ts-api-utils";
import { isMatching, match, P } from "ts-pattern";
import { defineRule, type AST, type Context, type ReportDescriptor } from "tsl";
import ts from "typescript";

import { Reporter as RPT } from "../kit/kit.ts";
import { unit } from "../lib/eff.ts";

export const RULE_NAME = "noLeakedConditionalRendering";

export const messages = {
  noLeakedConditionalRendering: (value: string) =>
    `Potential leaked value ${value} that might cause unintentionally rendered values or rendering crashes.`,
} as const;

// #region Types

/** The types we care about */

type VariantType =
  | "any"
  | "bigint"
  | "boolean"
  | "enum"
  | "never"
  | "nullish"
  | "number"
  | "object"
  | "string"
  | "unknown"
  | "falsy bigint"
  | "falsy boolean"
  | "falsy number"
  | "falsy string"
  | "truthy bigint"
  | "truthy boolean"
  | "truthy number"
  | "truthy string";

// #endregion

// #region Helpers

const tsHelpers = {
  isAnyType: (type: ts.Type) => isTypeFlagSet(type, ts.TypeFlags.TypeParameter | ts.TypeFlags.Any),
  isBigIntType: (type: ts.Type) => isTypeFlagSet(type, ts.TypeFlags.BigIntLike),
  isBooleanType: (type: ts.Type) => isTypeFlagSet(type, ts.TypeFlags.BooleanLike),
  isEnumType: (type: ts.Type) => isTypeFlagSet(type, ts.TypeFlags.EnumLike),
  isFalsyBigIntType: (type: ts.Type) => type.isLiteral() && isMatching({ value: { base10Value: "0" } }, type),
  isFalsyNumberType: (type: ts.Type) => type.isNumberLiteral() && type.value === 0,
  isFalsyStringType: (type: ts.Type) => type.isStringLiteral() && type.value === "",
  isNeverType: (type: ts.Type) => isTypeFlagSet(type, ts.TypeFlags.Never),
  isNullishType: (type: ts.Type) =>
    isTypeFlagSet(
      type,
      ts.TypeFlags.Null
        | ts.TypeFlags.Undefined
        | ts.TypeFlags.VoidLike,
    ),
  isNumberType: (type: ts.Type) => isTypeFlagSet(type, ts.TypeFlags.NumberLike),
  isObjectType: (type: ts.Type) =>
    !isTypeFlagSet(
      type,
      ts.TypeFlags.Null
        | ts.TypeFlags.Undefined
        | ts.TypeFlags.VoidLike
        | ts.TypeFlags.BooleanLike
        | ts.TypeFlags.StringLike
        | ts.TypeFlags.NumberLike
        | ts.TypeFlags.BigIntLike
        | ts.TypeFlags.TypeParameter
        | ts.TypeFlags.Any
        | ts.TypeFlags.Unknown
        | ts.TypeFlags.Never,
    ),
  isStringType: (type: ts.Type) => isTypeFlagSet(type, ts.TypeFlags.StringLike),
  isTruthyBigIntType: (type: ts.Type) => type.isLiteral() && isMatching({ value: { base10Value: P.not("0") } }, type),
  isTruthyNumberType: (type: ts.Type) => type.isNumberLiteral() && type.value !== 0,
  isTruthyStringType: (type: ts.Type) => type.isStringLiteral() && type.value !== "",
  isUnknownType: (type: ts.Type) => isTypeFlagSet(type, ts.TypeFlags.Unknown),
} as const;

/**
 * Ported from https://github.com/typescript-eslint/typescript-eslint/blob/eb736bbfc22554694400e6a4f97051d845d32e0b/packages/eslint-plugin/src/rules/strict-boolean-expressions.ts#L826 with some enhancements
 * Check union variants for the types we care about
 * @param types The types to inspect
 * @returns The variant types found
 */
function inspectVariantTypes(types: ts.Type[]) {
  const variantTypes = new Set<VariantType>();
  if (types.some(tsHelpers.isUnknownType)) {
    variantTypes.add("unknown");
    return variantTypes;
  }
  if (types.some(tsHelpers.isNullishType)) {
    variantTypes.add("nullish");
  }
  const booleans = types.filter(tsHelpers.isBooleanType);
  // If incoming type is either "true" or "false", there will be one type
  // object with intrinsicName set accordingly
  // If incoming type is boolean, there will be two type objects with
  // intrinsicName set "true" and "false" each because of ts-api-utils.unionTypeParts()
  switch (true) {
    case booleans.length === 1 && booleans[0] != null: {
      const first = booleans[0];
      if (isTrueLiteralType(first)) {
        variantTypes.add("truthy boolean");
      } else if (isFalseLiteralType(first)) {
        variantTypes.add("falsy boolean");
      }
      break;
    }
    case booleans.length === 2: {
      variantTypes.add("boolean");
      break;
    }
  }
  const strings = types.filter(tsHelpers.isStringType);
  if (strings.length > 0) {
    const evaluated = match<ts.Type[], VariantType>(strings)
      .when((types) => types.every(tsHelpers.isTruthyStringType), () => "truthy string")
      .when((types) => types.every(tsHelpers.isFalsyStringType), () => "falsy string")
      .otherwise(() => "string" as const);
    variantTypes.add(evaluated);
  }
  const bigints = types.filter(tsHelpers.isBigIntType);
  if (bigints.length > 0) {
    const evaluated = match<ts.Type[], VariantType>(bigints)
      .when((types) => types.every(tsHelpers.isTruthyBigIntType), () => "truthy bigint")
      .when((types) => types.every(tsHelpers.isFalsyBigIntType), () => "falsy bigint")
      .otherwise(() => "bigint");
    variantTypes.add(evaluated);
  }
  const numbers = types.filter(tsHelpers.isNumberType);
  if (numbers.length > 0) {
    const evaluated = match<ts.Type[], VariantType>(numbers)
      .when((types) => types.every(tsHelpers.isTruthyNumberType), () => "truthy number")
      .when((types) => types.every(tsHelpers.isFalsyNumberType), () => "falsy number")
      .otherwise(() => "number" as const);
    variantTypes.add(evaluated);
  }
  if (types.some(tsHelpers.isEnumType)) {
    variantTypes.add("enum");
  }
  if (types.some(tsHelpers.isObjectType)) {
    variantTypes.add("object");
  }
  if (types.some(tsHelpers.isAnyType)) {
    variantTypes.add("any");
  }
  if (types.some(tsHelpers.isNeverType)) {
    variantTypes.add("never");
  }
  return variantTypes;
}

// #endregion

// TODO: Port the rule from https://github.com/Rel1cx/eslint-react/blob/2.0.0-beta/packages/plugins/eslint-plugin-react-x/src/rules/no-leaked-conditional-rendering.ts
export const noLeakedConditionalRendering = defineRule(() => {
  return {
    name: `@react-analyzer/${RULE_NAME}`,
    createData(context) {
      const { version } = getSettingsFromContext(context);
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
      ] as const satisfies VariantType[];

      function getReportDescriptor(
        node:
          | unit
          | AST.Expression
          | AST.JsxExpression
          | AST.JsxExpression["expression"],
      ): ReportDescriptor | unit {
        // TODO: Implement the logic to generate a report descriptor
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

function getSettingsFromContext(context: Omit<Context<unknown>, "data">): { version: string } {
  throw new Error("Function not implemented.");
}
