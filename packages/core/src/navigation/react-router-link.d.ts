import React from "react";
import { LinkProps as RouterLinkProps } from "react-router-dom";
import Component, { ComponentProps } from "../component";
export interface LinkProps extends ComponentProps, RouterLinkProps {
    ariaCurrent?: string;
    _component?: React.ReactNode;
}
export default class Link extends Component<LinkProps> {
    static jsClass: string;
    protected tag: any;
    protected get componentProps(): Record<string, any>;
}
//# sourceMappingURL=react-router-link.d.ts.map