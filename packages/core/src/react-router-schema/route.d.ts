import React from "react";
import { RouteProps as RoutePropsRR } from "react-router-dom";
import Component, { ComponentProps } from "../component";
export interface RouteProps extends ComponentProps, Omit<RoutePropsRR, 'children'> {
    component: string;
    routes: Record<string, RouteProps> | RouteProps[];
    test?: boolean;
}
export default class Route extends Component<RouteProps> {
    static jsClass: string;
    static wrapper: boolean;
    render(): React.JSX.Element;
}
//# sourceMappingURL=route.d.ts.map