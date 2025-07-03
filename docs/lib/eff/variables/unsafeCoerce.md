[**@react-analyzer/tsl**](../../../README.md)

***

[@react-analyzer/tsl](../../../README.md) / [lib/eff](../README.md) / unsafeCoerce

# Variable: unsafeCoerce()

> `const` **unsafeCoerce**: \<`A`, `B`\>(`a`) => `B`

Casts the result to the specified type.

## Type Parameters

### A

`A`

### B

`B`

## Parameters

### a

`A`

## Returns

`B`

## Example

```ts
import * as assert from "node:assert"
import { unsafeCoerce, identity } from "effect/Function"

assert.deepStrictEqual(unsafeCoerce, identity)
```
