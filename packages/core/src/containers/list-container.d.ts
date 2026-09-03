import React from "react";
import Container, { ContainerProps, ContainerState } from "./container";
export interface ListContainerProps extends ContainerProps {
    liClasses?: string | string[];
}
export interface ListContainerState extends ContainerState {
}
export default class ListContainer<TProps extends ListContainerProps = ListContainerProps, TState extends ListContainerState = ListContainerState> extends Container<TProps, TState> {
    static jsClass: string;
    static defaultProps: {
        liClasses: never[];
        fullWidth: boolean;
        tag: string;
        fluid?: boolean | undefined;
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
        ref?: React.Ref<any> | undefined;
    };
    constructor(props: TProps);
    li(children?: TProps[string], extraClasses?: string | string[]): (React.JSX.Element | null)[];
    content(children?: TProps[string]): string | number | bigint | boolean | Iterable<React.ReactNode> | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | React.JSX.Element | null;
}
//# sourceMappingURL=list-container.d.ts.map