import React from "react";
import { RouteProps } from "./route";
/**
 * Higher-order component to manage class names and styles in the body element
 * based on the current route and its properties.
 *
 * @param {React.ComponentType<P>} WrappedComponent - The component to wrap (Controller).
 * @param {Route} route - The current route object containing name, style, and other properties.
 * @returns {React.FC<P>} - The wrapped component with added functionality.
 */
declare const withRouteWrapper: <P extends object>(WrappedComponent: React.ComponentType<P>, route: RouteProps) => React.FC<P>;
export default withRouteWrapper;
//# sourceMappingURL=with-route-wrapper.d.ts.map