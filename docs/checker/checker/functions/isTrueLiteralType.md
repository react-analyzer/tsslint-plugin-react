[**@react-analyzer/tsl**](../../../README.md)

***

[@react-analyzer/tsl](../../../README.md) / [checker/checker](../README.md) / isTrueLiteralType

# Function: isTrueLiteralType()

> **isTrueLiteralType**(`type`): `type is TrueLiteralType`

Determines whether the given type is a boolean literal type for "true".

## Parameters

### type

`Type`

## Returns

`type is TrueLiteralType`

## Example

```ts
declare const type: ts.Type;

if (isTrueLiteralType(type)) {
  // ...
}
```
