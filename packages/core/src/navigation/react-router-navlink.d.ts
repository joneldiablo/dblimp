import React from "react";
import { NavLinkProps as RouterNavLinkProps } from "react-router-dom";
import Component, { ComponentProps } from "../component";
export interface NavLinkProps extends ComponentProps, RouterNavLinkProps {
    ariaCurrent?: string;
    _component?: React.ReactNode;
}
export default class NavLink extends Component<NavLinkProps> {
    static jsClass: string;
    protected tag: any;
    protected get componentProps(): Record<string, any>;
}
//# sourceMappingURL=react-router-navlink.d.ts.map