import React from "react";
import Container, { ContainerProps, ContainerState } from "./container";
export interface ScrollContainerProps extends ContainerProps {
    scrollTrackClasses?: string[];
    scrollBarClasses?: string[];
    scrollTrackStyle?: React.CSSProperties;
    scrollBarStyle?: React.CSSProperties;
}
export interface ScrollContainerState extends ContainerState {
}
export interface ScrollXNodeProps extends ScrollContainerProps {
    breakpoint?: string;
    orientation?: string;
    width?: number;
    height?: number;
}
export default class ScrollContainer<TProps extends ScrollContainerProps = ScrollContainerProps, TState extends ScrollContainerState = ScrollContainerState> extends Container<TProps, TState> {
    static jsClass: string;
    content(children?: TProps[string]): React.JSX.Element;
}
//# sourceMappingURL=scroll-container.d.ts.map