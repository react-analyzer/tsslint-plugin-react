# @react-analyzer/tsl

(WIP) Bring the same linting functionality that [`eslint-react.xyz`](https://eslint-react.xyz) has to the TypeScript LSP.

This package provides the rulesets from [`beta.eslint-react.xyz/docs/rules/overview`](https://beta.eslint-react.xyz/docs/rules/overview) as custom rules for the [ArnaudBarre/tsl](https://github.com/ArnaudBarre/tsl) linting tool.

## Installation

```bash
pnpm add -D tsl @react-analyzer/tsl
```

Then follow the [installation guide](https://github.com/ArnaudBarre/tsl?tab=readme-ov-file#installation) for tsl.

## Enabling rules

```diff
// tsl.config.ts
import { core, defineConfig } from "tsl";
+ import { rules as react } from "@react-analyzer/tsl";

export default defineConfig({
  rules: [
    ...core.all(),
+    react.noLeakedConditionalRendering(),
  ],
});
```

## Specifying project-aware React configuration

In your `tsconfig.json` or `jsconfig.json` add the following:

```diff
{
  "compilerOptions": {
+    "jsx": "react-jsx",
    "plugins": [{ "name": "tsl/plugin" }],
  },
+  "react": {
+    "version": "19.1.0" // or "detect" to automatically detect the version
+    // other options can be added here
+  }
}
```

## Acknowledgements

We extend our gratitude to:

- **[ArnaudBarre/tsl](https://github.com/ArnaudBarre/tsl)** for the core and AST type rewrite, which significantly streamlined custom rules development within TypeScript Language Service Plugin.
- **[johnsoncodehk/tsslint](https://github.com/johnsoncodehk/tsslint)** for their early explorations of exposing the TypeScript Language Server diagnostic interface.
- **[typescript-eslint/typescript-eslint](https://github.com/typescript-eslint/typescript-eslint)** for providing the foundation where these custom rules were initially developed and tested.
- **[Effect-TS/language-service](https://github.com/Effect-TS/language-service)** for inspiring the creation of [`typescriptreact-language-service`](https://github.com/react-analyzer/tsl/commit/01ab1d8d954d555bff65246c61af8c1028be78f1#diff-b335630551682c19a781afebcf4d07bf978fb1f8ac04c6bf87428ed5106870f5) (now [`@react-analyzer/tsl`](https://github.com/react-analyzer/tsl)).
