import React from "react";

import Component from "./component";

/**
 * Shared component registry consumed by `JsonRender`.
 *
 * This module is intentionally free of imports to category barrels
 * (`containers`, `fields`, `media`, `navigation`) so that evaluating it never
 * creates a circular dependency: the category modules register into this
 * registry as a module-side effect when they are loaded.
 */
const COMPONENTS: Record<
  string,
  React.FC<any> | typeof React.Component<any, any>
> = {
  Component,
};

/**
 * Extends the components registry with custom components.
 *
 * @example
 * ```ts
 * addComponents({ Custom: MyComponent });
 * ```
 */
export const addComponents = (
  components: Record<
    string,
    React.FC<any> | typeof React.Component | {} | false
  >
): boolean => {
  if (!components) return false;
  Object.assign(COMPONENTS, components);
  return true;
};

/**
 * Resolves a component registered by name.
 */
export const getComponent = (
  name: string
): React.FC<any> | typeof React.Component<any, any> | undefined =>
  COMPONENTS[name] as React.FC<any> | typeof React.Component<any, any> | undefined;

export default COMPONENTS;