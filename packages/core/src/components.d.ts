import React from "react";
export * from "./component";
export * from "./goat-component";
export * from "./containers";
export * from "./fields";
export * from "./media";
export * from "./navigation";
export * from "./react-router-schema/route";
/**
 * Registry of available React components used by `Goat`.
 */
declare const COMPONENTS: Record<string, React.FC<any> | typeof React.Component<any, any>>;
/**
 * Extends the components registry with custom components.
 *
 * @example
 * ```ts
 * addComponents({ Custom: MyComponent });
 * ```
 */
export declare const addComponents: (components: Record<string, React.FC<any> | typeof React.Component | {} | false>) => boolean;
export default COMPONENTS;
//# sourceMappingURL=components.d.ts.map