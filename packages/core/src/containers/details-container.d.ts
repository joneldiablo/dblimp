import React from "react";
import Component, { ComponentProps, ComponentState } from "../component";
export interface DetailsContainerProps extends ComponentProps {
    open?: boolean;
    label?: React.ReactNode;
    containerClasses?: string | string[];
    labelClasses?: string | string[];
    id?: string;
    data?: any;
}
export interface DetailsContainerState extends ComponentState {
    open: boolean;
}
export default class DetailsContainer<TProps extends DetailsContainerProps = DetailsContainerProps, TState extends DetailsContainerState = DetailsContainerState> extends Component<TProps, TState> {
    static jsClass: string;
    protected events: [string, (event: any) => void][];
    protected ref: React.RefObject<HTMLDetailsElement | null>;
    constructor(props: TProps);
    get componentProps(): {
        open: boolean;
    };
    componentDidMount(): void;
    componentWillUnmount(): void;
    onUpdate: ({ open }: {
        open?: boolean;
    }) => void;
    onToggle(evt: Event): void;
    content(children?: React.ReactNode): React.JSX.Element;
}
//# sourceMappingURL=details-container.d.ts.map