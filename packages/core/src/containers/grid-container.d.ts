import React, { JSX } from "react";
import Container, { ContainerProps, ContainerState } from "./container";
export interface GridContainerProps extends ContainerProps {
    colClasses?: string | string[];
    colTag?: keyof JSX.IntrinsicElements;
}
export interface GridContainerState extends ContainerState {
}
export default class GridContainer<TProps extends GridContainerProps = GridContainerProps, TState extends GridContainerState = GridContainerState> extends Container<TProps, TState> {
    static jsClass: string;
    static defaultProps: {
        colClasses: never[];
        colTag: string;
        fluid?: boolean | undefined;
        fullWidth?: boolean | undefined;
        breakpoints?: import("./container").Breakpoints | undefined;
        xsClasses?: string | string[] | undefined;
        smClasses?: string | string[] | undefined;
        mdClasses?: string | string[] | undefined;
        lgClasses?: string | string[] | undefined;
        xlClasses?: string | string[] | undefined;
        xxlClasses?: string | string[] | undefined;
        onResize?: ((resp: import("./container").ResizeResponse) => void) | undefined;
        _props?: Record<string, any> | undefined;
        active?: boolean | undefined;
        classes?: import("..").Classes | undefined;
        name?: string | undefined;
        tag?: (keyof JSX.IntrinsicElements | false | React.ExoticComponent<{
            children?: React.ReactNode;
        }> | string) | undefined;
        ref?: React.Ref<any> | undefined;
    };
    constructor(props: TProps);
    grid(children?: TProps[string], extraClasses?: string | string[]): (React.DetailedReactHTMLElement<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> | null)[];
    content(children?: TProps[string]): string | number | bigint | boolean | Iterable<React.ReactNode> | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | JSX.Element | null;
}
//# sourceMappingURL=grid-container.d.ts.map