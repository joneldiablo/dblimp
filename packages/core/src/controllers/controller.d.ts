import GoatContainer, { GoatContainerProps, GoatContainerState } from "../containers/goat-container";
export interface ControllerProps extends GoatContainerProps {
    test?: boolean;
    routesIn?: string;
    [key: string]: any;
}
export interface ControllerState extends GoatContainerState {
    localClasses: string;
}
/**
 * View component that extends JsonRenderContainer
 */
export default class Controller<TProps extends ControllerProps = ControllerProps, TState extends ControllerState = ControllerState> extends GoatContainer<TProps, TState> {
    static jsClass: string;
    static defaultProps: Partial<ControllerProps>;
    static template: null;
    constructor(props: TProps);
    get fixedProps(): TProps;
    get childrenIn(): string | boolean;
    get theView(): any;
    componentDidUpdate(prevProps: TProps): void;
}
//# sourceMappingURL=controller.d.ts.map