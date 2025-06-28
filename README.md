# @react-analyzer/tsl

(WIP) Bring the same linting functionality that [`eslint-react.xyz`](https://eslint-react.xyz) has to the TypeScript LSP.

## Installation

```bash
pnpm add -D tsl @react-analyzer/tsl
```

> [!NOTE]\
> TS 5.8 is expected as a peer dependency.

### Add a configuration

Add a `tsl.config.ts` file to your project root. If you don't have one, all core rules are enabled (cli only, editor integration requires a config).

You can either enable all core and react rules and disable some of them or update options if needed, or pick only the rules you want to enable.

```ts
// tsl.config.ts
import { core, defineConfig } from "tsl";
import { rules as react } from "@react-analyzer/tsl";

export default defineConfig({
  rules: [
    ...core.all(),
    react.noLeakedConditionalRendering(),
  ],
});
```

### Add the TypeScript plugin

In your `tsconfig.json` add the following:

```json
{
  "compilerOptions": {
    "plugins": [{ "name": "tsl/plugin" }]
  }
}
```

[Full Installation Guide ↗](https://github.com/ArnaudBarre/tsl?tab=readme-ov-file#installation)

## Thanks

- [ArnaudBarre](https://github.com/ArnaudBarre) for his work on [`tsl`](https://github.com/ArnaudBarre/tsl), especially the AST type rewrite effort that made it much easier to work with when developing custom rules.
- [Johnson Chu](https://github.com/johnsoncodehk) for his work on [TSSlint](https://github.com/johnsoncodehk/tsslint) that this project previously intended to be based on.
- [typescript-eslint/typescript-eslint](https://github.com/typescript-eslint/typescript-eslint) for providing the foundation where these custom rules were developed and tested before being ported to this project.
- [Effect-TS/language-service](https://github.com/Effect-TS/language-service) for the inspiration of creating [`typescriptreact-language-service`](https://github.com/react-analyzer/tsl/commit/01ab1d8d954d555bff65246c61af8c1028be78f1#diff-b335630551682c19a781afebcf4d07bf978fb1f8ac04c6bf87428ed5106870f5) (which is now `@react-analyzer/tsl`).
