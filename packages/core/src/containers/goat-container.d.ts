import { ReactNode } from "react";
import Goat from "../goat";
import Container, { ContainerProps, ContainerState } from "./container";
/**
 * Props for {@link GoatContainer}.
 *
 * @example
 * ```tsx
 * <GoatContainer name="sample" view={{ name: "test", component: "Component", content: "Hi" }} />
 * ```
 */
export interface GoatContainerProps extends ContainerProps {
    /** Whether the container should take the full width available. */
    fullWidth?: boolean;
    /** View schema to render using {@link Goat}. */
    view?: any;
    /** If true, children are rendered inside the generated content. */
    childrenIn?: boolean;
    /** Additional JSON schema definitions. */
    definitions?: Record<string, any>;
    /** Direct content passed to the container. */
    content?: string | any[] | object;
    /** React children to render. */
    children?: ReactNode;
}
/**
 * State for {@link GoatContainer}.
 */
export interface GoatContainerState extends ContainerState {
    [key: string]: any;
}
/** Template structure for static rendering. */
export interface ContainerTemplateSchema {
    /** Default view schema. */
    view: Record<string, any>;
    /** Optional shared definitions. */
    definitions?: Record<string, any>;
}
/**
 * Container capable of rendering a JSON schema using {@link Goat}.
 */
export default class GoatContainer<TProps extends GoatContainerProps = GoatContainerProps, TState extends GoatContainerState = GoatContainerState> extends Container<TProps, TState> {
    static jsClass: string;
    static template?: ContainerTemplateSchema | null;
    static defaultProps: Partial<GoatContainerProps>;
    protected events: [string, (...args: any[]) => void][];
    protected goat: Goat;
    protected templateSolved: any;
    constructor(props: TProps);
    get fixedProps(): TProps;
    get childrenIn(): string | boolean;
    get theView(): any;
    get theTemplate(): any;
    componentDidMount(): void;
    /**
     * Resolves the template with provided definitions and view overrides.
     */
    evalTemplate(): void;
    componentWillUnmount(): void;
    mutations(sectionName: string, section: any): any;
    /**
     * Builds content using {@link Goat} and optionally renders children inside.
     */
    content(children?: TProps["children"] | undefined): any;
}
//# sourceMappingURL=goat-container.d.ts.map