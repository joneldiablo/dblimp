import React from "react";
import Component, { ComponentProps, ComponentState } from "../component";
export interface AutoResponsiveContainerProps extends ComponentProps {
    className?: string;
}
export interface AutoResponsiveContainerState extends ComponentState {
    id: string;
}
export default class AutoResponsiveContainer<TProps extends AutoResponsiveContainerProps = AutoResponsiveContainerProps, TState extends AutoResponsiveContainerState = AutoResponsiveContainerState> extends Component<TProps, TState> {
    static jsClass: string;
    protected wrapper: React.RefObject<HTMLDivElement | null>;
    constructor(props: TProps);
    render(): React.JSX.Element;
}
//# sourceMappingURL=auto-responsive-container.d.ts.map