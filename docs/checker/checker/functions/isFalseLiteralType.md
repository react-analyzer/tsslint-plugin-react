[**@react-analyzer/tsl**](../../../README.md)

***

[@react-analyzer/tsl](../../../README.md) / [checker/checker](../README.md) / isFalseLiteralType

# Function: isFalseLiteralType()

> **isFalseLiteralType**(`type`): `type is FalseLiteralType`

Determines whether the given type is a boolean literal type for "false".

## Parameters

### type

`Type`

## Returns

`type is FalseLiteralType`

## Example

```ts
declare const type: ts.Type;

if (isFalseLiteralType(type)) {
  // ...
}
```
