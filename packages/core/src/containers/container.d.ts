import React, { ReactNode } from "react";
import ResizeSensor from "css-element-queries/src/ResizeSensor";
import Component, { ComponentProps, ComponentState } from "../component";
export interface Breakpoints {
    [key: string]: number;
}
export interface ContainerProps extends ComponentProps {
    /**
     * If `true` adds the `container-fluid` class when not using `fullWidth`.
     */
    fluid?: boolean;
    /**
     * Avoids adding bootstrap container classes when `true`.
     */
    fullWidth?: boolean;
    breakpoints?: Breakpoints;
    xsClasses?: string | string[];
    smClasses?: string | string[];
    mdClasses?: string | string[];
    lgClasses?: string | string[];
    xlClasses?: string | string[];
    xxlClasses?: string | string[];
    onResize?: (resp: ResizeResponse) => void;
}
export interface ResizeResponse {
    width: number;
    height: number;
    breakpoint: string | undefined;
    orientation: "landscape" | "portrait";
}
export interface ContainerState extends ComponentState {
}
export default class Container<TProps extends ContainerProps = ContainerProps, TState extends ContainerState = ContainerState> extends Component<TProps, TState> {
    static jsClass: string;
    static defaultProps: Partial<ContainerProps>;
    protected breakpoint: string | undefined;
    protected orientation: "landscape" | "portrait" | undefined;
    protected width: number;
    protected height: number;
    protected waitBreakpoint: React.JSX.Element;
    protected resizeSensor?: ResizeSensor;
    protected onResizeTimeout?: NodeJS.Timeout;
    constructor(props: TProps);
    get componentProps(): {
        id: TProps["name"];
    };
    updateSize(): void;
    onResize(firstTime?: boolean | {
        width: number;
        height: number;
    }): void;
    componentDidUpdate(prevProps: TProps): void;
    componentDidMount(): void;
    componentWillUnmount(): void;
    content(children?: ReactNode): string | number | bigint | boolean | Iterable<React.ReactNode> | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | React.JSX.Element | null;
}
//# sourceMappingURL=container.d.ts.map