[**@react-analyzer/tsl**](../../../../../README.md)

***

[@react-analyzer/tsl](../../../../../README.md) / [kit/kit](../../../README.md) / [Report](../README.md) / sendOrElse

# Variable: sendOrElse()

> `const` **sendOrElse**: \{\<`TElse`\>(`context`, `descriptor`, `cb`): `undefined` \| `TElse`; \<`TElse`\>(`context`): (`descriptor`) => (`cb`) => `undefined` \| `TElse`; \}

## Call Signature

> \<`TElse`\>(`context`, `descriptor`, `cb`): `undefined` \| `TElse`

### Type Parameters

#### TElse

`TElse`

### Parameters

#### context

`Context`

#### descriptor

`undefined` | `ReportDescriptor`

#### cb

() => `TElse`

### Returns

`undefined` \| `TElse`

## Call Signature

> \<`TElse`\>(`context`): (`descriptor`) => (`cb`) => `undefined` \| `TElse`

### Type Parameters

#### TElse

`TElse`

### Parameters

#### context

`Context`

### Returns

> (`descriptor`): (`cb`) => `undefined` \| `TElse`

#### Parameters

##### descriptor

`undefined` | `ReportDescriptor`

#### Returns

> (`cb`): `undefined` \| `TElse`

##### Parameters

###### cb

() => `TElse`

##### Returns

`undefined` \| `TElse`
