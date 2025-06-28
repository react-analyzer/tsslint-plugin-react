# @react-analyzer/tsl

(WIP) Bring the same linting functionality that [`eslint-react.xyz`](https://eslint-react.xyz) has to the TypeScript LSP.

## Thanks

- [ArnaudBarre](https://github.com/ArnaudBarre) for his work on [`tsl`](https://github.com/ArnaudBarre/tsl), especially the AST type rewrite effort that made it much easier to work with when developing custom rules.
- [Johnson Chu](https://github.com/johnsoncodehk) for his work on [TSSlint](https://github.com/johnsoncodehk/tsslint) that this project previously intended to be based on.
- [Effect-TS/language-service](https://github.com/Effect-TS/language-service) for the inspiration of creating [`typescriptreact-language-service`](https://github.com/react-analyzer/tsl/commit/01ab1d8d954d555bff65246c61af8c1028be78f1#diff-b335630551682c19a781afebcf4d07bf978fb1f8ac04c6bf87428ed5106870f5) (which is now `@react-analyzer/tsl`).
- [typescript-eslint/typescript-eslint](https://github.com/typescript-eslint/typescript-eslint) for providing the foundation where these custom rules were developed and tested before being ported to this project.
