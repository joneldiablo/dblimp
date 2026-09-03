import React from "react";
import Component, { ComponentProps, ComponentState } from "../component";
export interface FormContainerProps extends ComponentProps {
    label?: React.ReactNode;
    labelClasses?: string;
    fields: Record<string, any> | Array<string | Record<string, any>>;
}
export interface FormContainerState extends ComponentState {
    data: Record<string, any>;
    invalidFields: Record<string, any>;
    defaultValues: Record<string, any>;
}
export default class FormContainer<TProps extends FormContainerProps = FormContainerProps, TState extends FormContainerState = FormContainerState> extends Component<TProps, TState> {
    static jsClass: string;
    static defaultProps: {
        fields: never[];
        _props?: Record<string, any> | undefined;
        active?: boolean | undefined;
        classes?: import("../component").Classes | undefined;
        name?: string | undefined;
        tag?: (keyof React.JSX.IntrinsicElements | false | React.ExoticComponent<{
            children?: React.ReactNode;
        }> | string) | undefined;
        ref?: React.Ref<any> | undefined;
    };
    form: React.RefObject<HTMLFormElement | null>;
    private timeoutInvalid?;
    private timeoutOnChange?;
    private timeoutCheckValidity?;
    private mergeDefault;
    protected events: [string, (event: any) => void][];
    protected readyEvents: [string, (event: any) => void][];
    constructor(props: TProps);
    componentDidMount(): void;
    componentWillUnmount(): void;
    checkValidity(): void;
    onReadyOnce(): void;
    fieldsForEach(func: (field: Record<string, any>, index: number) => void): void;
    onUpdate: ({ data, reset, default: dataDefault, update, clearData, mergeDefault, }: any) => void;
    onDefault: (data: Record<string, any>) => void;
    reset(): void;
    onInvalid: () => void;
    onInvalidField: (invalidData: Record<string, any>) => void;
    onSubmit: (e: React.FormEvent) => Promise<void>;
    onChange(fieldData: Record<string, any>): void;
    content(children?: TProps[string]): React.JSX.Element;
}
//# sourceMappingURL=form-container.d.ts.map