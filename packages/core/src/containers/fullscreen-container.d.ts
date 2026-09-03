import React from "react";
import Component, { ComponentProps, ComponentState } from "../component";
export interface FullscreenContainerProps extends ComponentProps {
    overflow?: string;
    gutter?: number;
}
export interface FullscreenContainerState extends ComponentState {
}
export default class FullscreenContainer<TProps extends FullscreenContainerProps = FullscreenContainerProps, TState extends FullscreenContainerState = FullscreenContainerState> extends Component<TProps, TState> {
    static jsClass: string;
    static defaultProps: Partial<FullscreenContainerProps>;
    protected style: React.CSSProperties;
    constructor(props: TProps);
    protected content(children?: TProps[string]): React.ReactNode;
}
//# sourceMappingURL=fullscreen-container.d.ts.map