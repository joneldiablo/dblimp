import React from "react";

import Component from "./component";
import JsonRenderComponent from "./json-render-component";
import containers from "./containers";
import fields from "./fields";
import mediaComponents from "./media";
import navigationComponents from "./navigation";
import Route from "./react-router-schema/route";

export * from "./component";
export * from "./json-render-component";
export * from "./containers";
export * from "./fields";
export * from "./media";
export * from "./navigation";
export * from "./react-router-schema/route";

/**
 * Registry of available React components used by `JsonRender`.
 */
const COMPONENTS: Record<
  string,
  React.FC<any> | typeof React.Component<any, any>
> = {
  Component,
  JsonRenderComponent,
  ...containers,
  ...fields,
  ...mediaComponents,
  ...navigationComponents,
  Route,
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

export default COMPONENTS;
