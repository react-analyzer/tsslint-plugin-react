import { createRulesSet } from "tsl";
import { noLeakedConditionalRendering } from "./rules/noLeakedConditionalRendering.ts";

export const rules = createRulesSet({
  /**
   * Prevents problematic leaked values from being rendered.
   *
   * Using the && operator to render some element conditionally in JSX can cause unexpected values being rendered, or even crashing the rendering.
   *
   * **Examples**
   *
   * ```tsx
   * import React from "react";
   *
   * interface MyComponentProps {
   *   count: number;
   * }
   *
   * function MyComponent({ count }: MyComponentProps) {
   *   return <div>{count && <span>There are {count} results</span>}</div>;
   *   //           ^^^^^
   *   //           - Potential leaked value 'count' that might cause unintentionally rendered values or rendering crashes.
   * }
   * ```
   *
   * ```tsx
   * import React from "react";
   *
   * interface MyComponentProps {
   *   items: string[];
   * }
   *
   * function MyComponent({ items }: MyComponentProps) {
   *   return <div>{items.length && <List items={items} />}</div>;
   *   //           ^^^^^^^^^^^^
   *   //           - Potential leaked value 'items.length' that might cause unintentionally rendered values or rendering crashes.
   * }
   * ```
   *
   * ```tsx
   * import React from "react";
   *
   * interface MyComponentProps {
   *   items: string[];
   * }
   *
   * function MyComponent({ items }: MyComponentProps) {
   *   return <div>{items[0] && <List items={items} />}</div>;
   *   //           ^^^^^^^^
   *   //           - Potential leaked value 'items[0]' that might cause unintentionally rendered values or rendering crashes.
   * }
   * ```
   *
   * @since 0.0.0
   */
  noLeakedConditionalRendering,
  // TODO: Port more rules from https://beta.eslint-react.xyz/docs/rules/overview
});
