import { ReactNode } from "react";
import Goat from "./goat";
import Component, { ComponentProps, ComponentState } from "./component";
export interface GoatComponentProps extends ComponentProps {
    view?: any;
    childrenIn?: boolean;
    definitions?: Record<string, any>;
    content?: string | any[] | object;
    children?: ReactNode;
}
export interface GoatComponentState extends ComponentState {
    [key: string]: any;
}
export interface ComponentTemplateSchema {
    view: Record<string, any>;
    definitions?: Record<string, any>;
}
export default class GoatComponent<TProps extends GoatComponentProps = GoatComponentProps, TState extends GoatComponentState = GoatComponentState> extends Component<TProps, TState> {
    static jsClass: string;
    static template?: ComponentTemplateSchema | null;
    static defaultProps: Partial<GoatComponentProps>;
    protected events: [string, (...args: any[]) => void][];
    protected goat: Goat;
    protected templateSolved: any;
    constructor(props: TProps);
    get fixedProps(): TProps;
    get childrenIn(): string | boolean;
    get theView(): any;
    get theTemplate(): any;
    componentDidMount(): void;
    evalTemplate(): void;
    componentWillUnmount(): void;
    mutations(sectionName: string, section: any): any;
    content(children?: TProps["children"] | undefined): any;
}
//# sourceMappingURL=goat-component.d.ts.map