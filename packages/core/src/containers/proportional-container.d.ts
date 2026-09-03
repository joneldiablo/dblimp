import React from "react";
import Container, { ContainerProps, ContainerState } from "./container";
export interface ProportionalContainerProps extends ContainerProps {
    ratio?: string | Record<string, string | number> | number;
    overflow?: string;
    innerClasses?: string | string[];
}
export interface ProportionalContainerState extends ContainerState {
}
export default class ProportionalContainer<TProps extends ProportionalContainerProps = ProportionalContainerProps, TState extends ProportionalContainerState = ProportionalContainerState> extends Container<TProps, TState> {
    static jsClass: string;
    static defaultProps: Partial<ProportionalContainer>;
    private ratioResponsive?;
    protected style: React.CSSProperties;
    constructor(props: TProps);
    content(children?: React.ReactNode): React.JSX.Element;
}
//# sourceMappingURL=proportional-container.d.ts.map