import ResizeSensor from "css-element-queries/src/ResizeSensor";
import ComplexComponent, { ComplexComponentProps, ComplexComponentState } from "./complex-component";
/**
 * Props for {@link ComplexResponsiveComponent}.
 */
export interface ComplexResponsiveComponentProps extends ComplexComponentProps {
    /** Breakpoints map used to assign responsive classes. */
    breakpoints?: Record<string, number>;
    /** Callback executed on resize events. */
    onResize?: (size: {
        width: number;
        height: number;
    }) => void;
}
/**
 * Extension of {@link ComplexComponent} that reacts to size changes and
 * dispatches a `resize` event with breakpoint information.
 */
export default class ComplexResponsiveComponent<TProps extends ComplexResponsiveComponentProps = ComplexResponsiveComponentProps, TState extends ComplexComponentState = ComplexComponentState> extends ComplexComponent<TProps, TState> {
    static jsClass: string;
    static defaultProps: Partial<ComplexResponsiveComponentProps>;
    protected resizeSensor?: ResizeSensor;
    protected onResizeTimeout?: NodeJS.Timeout;
    protected breakpoint?: string;
    componentDidMount(): void;
    componentWillUnmount(): void;
    /**
     * Handles element resize and updates breakpoint state.
     */
    onResize: () => void;
}
//# sourceMappingURL=complex-responsive-component.d.ts.map