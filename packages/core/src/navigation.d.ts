import Component, { ComponentProps } from "./component";
export type NavigationComponents = Record<string, typeof Component | React.FC<ComponentProps> | any>;
declare const NAVIGATION_COMPONENTS: NavigationComponents;
export declare const addNavigationComponents: (navigationComponents: NavigationComponents) => boolean;
export default NAVIGATION_COMPONENTS;
//# sourceMappingURL=navigation.d.ts.map