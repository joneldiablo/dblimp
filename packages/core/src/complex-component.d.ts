import React from "react";
import Goat from "./goat";
import Component, { ComponentProps, ComponentState } from "./component";
/**
 * Minimal schema accepted by {@link ComplexComponent}.
 */
export interface BasicSchemaType {
    /** View definition to render. */
    view: any;
    /** Shared definitions for resolving references. */
    definitions?: Record<string, any>;
    /** Arbitrary data passed along with the schema. */
    data?: any;
}
/**
 * Props for {@link ComplexComponent}.
 */
export interface ComplexComponentProps extends ComponentProps {
    /** JSON schema to render. */
    schema?: BasicSchemaType;
    /** Extra definitions merged into the schema. */
    definitions?: Record<string, any>;
    /** Optional rules for `resolveRefs`. */
    rules?: Record<string, any>;
    /** When true, children are rendered inside the content. */
    childrenIn?: boolean;
}
/**
 * State for {@link ComplexComponent}.
 */
export interface ComplexComponentState extends ComponentState {
    /** Resolved view schema. */
    view: any;
}
/**
 * Utility to create `$name*` helpers for schema definitions.
 */
export declare const nameSuffixes: (sfxs?: string[]) => Record<string, any>;
/**
 * Component capable of rendering a JSON schema using {@link Goat}.
 */
export default class ComplexComponent<TProps extends ComplexComponentProps = ComplexComponentProps, TState extends ComplexComponentState = ComplexComponentState> extends Component<TProps, TState> {
    static jsClass: string;
    static defaultProps: Partial<ComplexComponentProps>;
    protected events: [string, (...args: any[]) => void][];
    protected goat: Goat;
    constructor(props: TProps);
    componentDidMount(): void;
    componentWillUnmount(): void;
    /**
     * Builds a resolved view based on the provided schema and rules.
     */
    buildView(): any;
    mutations(sn: string, conf: Record<string, any>): any;
    /**
     * Renders the resolved schema and optionally appends children.
     */
    content(children?: React.ReactNode): React.ReactNode;
}
//# sourceMappingURL=complex-component.d.ts.map