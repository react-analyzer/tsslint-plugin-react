import { isFalseLiteralType, isTypeFlagSet } from "ts-api-utils";
import { isMatching, match, P } from "ts-pattern";
import ts from "typescript";

export const isAnyType = (type: ts.Type) => isTypeFlagSet(type, ts.TypeFlags.TypeParameter | ts.TypeFlags.Any);
export const isBigIntType = (type: ts.Type) => isTypeFlagSet(type, ts.TypeFlags.BigIntLike);
export const isBooleanType = (type: ts.Type) => isTypeFlagSet(type, ts.TypeFlags.BooleanLike);
export const isEnumType = (type: ts.Type) => isTypeFlagSet(type, ts.TypeFlags.EnumLike);
export const isFalsyBigIntType = (type: ts.Type) =>
  type.isLiteral() && isMatching({ value: { base10Value: "0" } }, type);
export const isFalsyNumberType = (type: ts.Type) => type.isNumberLiteral() && type.value === 0;
export const isFalsyStringType = (type: ts.Type) => type.isStringLiteral() && type.value === "";
export const isNeverType = (type: ts.Type) => isTypeFlagSet(type, ts.TypeFlags.Never);
export const isNullishType = (type: ts.Type) =>
  isTypeFlagSet(type, ts.TypeFlags.Null | ts.TypeFlags.Undefined | ts.TypeFlags.VoidLike);
export const isNumberType = (type: ts.Type) => isTypeFlagSet(type, ts.TypeFlags.NumberLike);
export const isObjectType = (type: ts.Type) =>
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
  );
export const isStringType = (type: ts.Type) => isTypeFlagSet(type, ts.TypeFlags.StringLike);
export const isTruthyBigIntType = (type: ts.Type) =>
  type.isLiteral() && isMatching({ value: { base10Value: P.not("0") } }, type);
export const isTruthyNumberType = (type: ts.Type) => type.isNumberLiteral() && type.value !== 0;
export const isTruthyStringType = (type: ts.Type) => type.isStringLiteral() && type.value !== "";
export const isUnknownType = (type: ts.Type) => isTypeFlagSet(type, ts.TypeFlags.Unknown);

export type Variant =
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

/**
 * Ported from https://github.com/typescript-eslint/typescript-eslint/blob/eb736bbfc22554694400e6a4f97051d845d32e0b/packages/eslint-plugin/src/rules/strict-boolean-expressions.ts#L826 with some enhancements
 * Check union variants for the types we care about
 * @param types The types to inspect
 * @returns The variant types found
 */
export function getVariantsOfType(types: ts.Type[]) {
  const variants = new Set<Variant>();
  if (types.some(isUnknownType)) {
    variants.add("unknown");
    return variants;
  }
  if (types.some(isNullishType)) {
    variants.add("nullish");
  }
  const booleans = types.filter(isBooleanType);
  const boolean0 = booleans[0];
  // If incoming type is either "true" or "false", there will be one type
  // object with intrinsicName set accordingly
  // If incoming type is boolean, there will be two type objects with
  // intrinsicName set "true" and "false" each because of ts-api-utils.unionTypeParts()
  if (booleans.length === 1 && boolean0 != null) {
    if (isFalseLiteralType(boolean0)) {
      variants.add("falsy boolean");
    } else if (isFalseLiteralType(boolean0)) {
      variants.add("truthy boolean");
    }
  } else if (booleans.length === 2) {
    variants.add("boolean");
  }
  const strings = types.filter(isStringType);
  if (strings.length > 0) {
    const evaluated = match<ts.Type[], Variant>(strings)
      .when((types) => types.every(isTruthyStringType), () => "truthy string")
      .when((types) => types.every(isFalsyStringType), () => "falsy string")
      .otherwise(() => "string" as const);
    variants.add(evaluated);
  }
  const bigints = types.filter(isBigIntType);
  if (bigints.length > 0) {
    const evaluated = match<ts.Type[], Variant>(bigints)
      .when((types) => types.every(isTruthyBigIntType), () => "truthy bigint")
      .when((types) => types.every(isFalsyBigIntType), () => "falsy bigint")
      .otherwise(() => "bigint");
    variants.add(evaluated);
  }
  const numbers = types.filter(isNumberType);
  if (numbers.length > 0) {
    const evaluated = match<ts.Type[], Variant>(numbers)
      .when((types) => types.every(isTruthyNumberType), () => "truthy number")
      .when((types) => types.every(isFalsyNumberType), () => "falsy number")
      .otherwise(() => "number" as const);
    variants.add(evaluated);
  }
  if (types.some(isEnumType)) {
    variants.add("enum");
  }
  if (types.some(isObjectType)) {
    variants.add("object");
  }
  if (types.some(isAnyType)) {
    variants.add("any");
  }
  if (types.some(isNeverType)) {
    variants.add("never");
  }
  return variants;
}
