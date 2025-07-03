[**@react-analyzer/tsl**](../../../README.md)

***

[@react-analyzer/tsl](../../../README.md) / [lib/eff](../README.md) / isFunction

# Function: isFunction()

> **isFunction**(`input`): `input is Function`

Tests if a value is a `function`.

## Parameters

### input

`unknown`

The value to test.

## Returns

`input is Function`

## Example

```ts
import * as assert from "node:assert"
import { isFunction } from "effect/Predicate"

assert.deepStrictEqual(isFunction(isFunction), true)
assert.deepStrictEqual(isFunction("function"), false)
```
