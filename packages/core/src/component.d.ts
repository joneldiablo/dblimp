import React, { ReactNode, JSX, ExoticComponent } from "react";
/**
 * Accepted class value formats.
 */
export type Classes = string | string[] | Record<string, string | string[]>;
/**
 * Props for {@link Component}.
 *
 * @example
 * ```tsx
 * class MyComponent extends Component {
 *   static jsClass = "MyComponent";
 * }
 * <MyComponent name="demo" />
 * ```
 */
export interface ComponentProps extends React.ComponentProps<any> {
    /** Extra props passed to the rendered tag. */
    _props?: Record<string, any>;
    /** Whether the component should render its content. */
    active?: boolean;
    /** Additional CSS classes to apply. */
    classes?: Classes;
    /** Base name for the component instance. */
    name: string;
    /**
     * Tag or component used for rendering. `false` renders a fragment.
     */
    tag?: keyof JSX.IntrinsicElements | false | ExoticComponent<{
        children?: ReactNode;
    }> | string;
    /** Optional ref forwarded to the element. */
    ref?: React.Ref<any>;
}
/**
 * Local state for {@link Component}.
 */
export interface ComponentState {
    /** Local CSS classes handled internally. */
    localClasses: string;
    /** Local styles handled internally. */
    localStyles: React.CSSProperties;
}
export default class Component<TProps extends ComponentProps = ComponentProps, TState extends ComponentState = ComponentState> extends React.Component<TProps, TState> {
    static jsClass: string;
    static defaultProps: Partial<ComponentProps>;
    static slots?: string[];
    static dontBuildContent?: boolean;
    static wrapper?: string | boolean;
    protected tag: keyof JSX.IntrinsicElements | React.FC | typeof React.Component | ExoticComponent;
    protected classes: string;
    protected style: React.CSSProperties;
    protected name: string;
    protected ref: React.RefObject<any>;
    protected ready?: NodeJS.Timeout;
    protected eventHandlers: Record<string, (...args: any[]) => void>;
    state: TState;
    constructor(props: TProps);
    protected setClasses(classes?: string | string[]): [Set<string>, Set<string>];
    protected toggleClasses(classes?: string | string[]): boolean;
    protected addClasses(classes?: string | string[] | null): boolean;
    protected deleteClasses(classes?: string | string[]): boolean;
    protected get componentProps(): Record<string, any> | undefined;
    protected content(children?: ReactNode): ReactNode;
    protected onEvent(e: Event): void;
    render(): JSX.Element;
}
//# sourceMappingURL=component.d.ts.map