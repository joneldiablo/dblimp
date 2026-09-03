import { ReactNode } from "react";
import Controller, { ControllerProps, ControllerState } from "./controller";
/**
 * Props for {@link TitleController}.
 *
 * @example
 * ```tsx
 * <TitleController name="title" label="Welcome" />
 * ```
 */
export interface TitleControllerProps extends ControllerProps {
    /** Heading text displayed above the controller content. */
    label?: string;
    /** Optional CSS classes for the heading element. */
    labelClasses?: string;
}
export interface TitleControllerState extends ControllerState {
}
/**
 * Controller that renders an `<h1>` before its child content.
 */
export default class TitleController<TProps extends TitleControllerProps = TitleControllerProps, TState extends TitleControllerState = TitleControllerState> extends Controller<TProps, TState> {
    static jsClass: string;
    /**
     * Renders the heading and delegates the remaining content to the parent.
     */
    content(children?: ReactNode): ReactNode;
}
//# sourceMappingURL=title-controller.d.ts.map