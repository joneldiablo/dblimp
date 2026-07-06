import React from "react";

import { eventHandler } from "dbl-utils";

import { Goat } from "@dblimp/core";
import Field, { FieldProps, FieldState } from "./field";
import NoWrapField from "./no-wrap-field";

//TODO: al cambiar parpadea la validación o.O

export interface NewPasswordFieldPattern {
  pattern: string;
  errorMessage: string;
}

export interface NewPasswordFieldProps extends FieldProps {
  labelRepeat?: string | React.ReactNode;
  placeholderRepeat?: string;
  dividerClasses?: string;
  patterns?: NewPasswordFieldPattern[];
  mutations?: (data: any) => any;
}

export interface NewPasswordFieldState extends FieldState {
  valueRepeat?: any;
}

export default class NewPasswordField extends Field<
  NewPasswordFieldProps,
  NewPasswordFieldState
> {
  static jsClass = "NewPasswordField";
  static defaultProps: Partial<NewPasswordFieldProps> = {
    ...Field.defaultProps,
    dividerClasses: "mb-3",
  };

  goat;

  constructor(props: NewPasswordFieldProps) {
    super(props);
    const { mutations, ...jProps } = props;
    this.goat = new Goat(jProps, mutations);
  }

  get type() {
    return "password";
  }

  componentDidMount() {
    super.componentDidMount();
    eventHandler.subscribe(
      `${this.props.name}-repeat`,
      this.onUpdateRepeat,
      this.unique
    );
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    eventHandler.unsubscribe(`${this.props.name}-repeat`, this.unique);
  }

  returnData(
    value = this.state.value,
    valueRepeat = (this.state as NewPasswordFieldState).valueRepeat
  ) {
    if (value === valueRepeat) super.returnData(value);
  }

  onUpdateRepeat = (data: any) => {
    this.setState(
      {
        valueRepeat: data[this.props.name + "-repeat"],
      } as any,
      () => !this.isInvalid() && this.returnData()
    );
  };

  isInvalid(
    value = this.state.value,
    valueRepeat = (this.state as NewPasswordFieldState).valueRepeat
  ) {
    const error = super.isInvalid(value);
    const diff = value !== valueRepeat;
    eventHandler.dispatch(`update.${this.props.name}-repeat`, { error: diff });
    return error;
  }

  get errorMessageNode() {
    const { errorMessage: em, patterns } = this.props;
    const { error, value } = this.state;
    if ((!error && !em) || !patterns) return false;
    const errorMessage = !patterns
      ? [em]
      : [
          em,
          React.createElement(
            "ul",
            {},
            ...Object.entries(patterns)
              .map(
                ([k, { pattern, errorMessage }]: any) =>
                  !value.match(pattern) && (
                    <li>{this.goat.buildContent(errorMessage)}</li>
                  )
              )
              .filter((p) => !!p)
          ),
        ];
    const errorNode = React.createElement(
      "div",
      { className: "m-1 lh-1" },
      React.createElement(
        "small",
        { className: "text-danger" },
        ...errorMessage
      )
    );
    return errorNode;
  }

  content(children = this.props.children): any {
    const {
      labelRepeat,
      placeholderRepeat,
      name,
      errorMessageRepeat,
      dividerClasses,
      inlineFields,
    } = this.props;
    const cloneFieldProps = {
      ...this.props,
      name: name + "-repeat",
      type: this.type,
      label: labelRepeat,
      placeholder: placeholderRepeat,
      errorMessage: errorMessageRepeat,
      required: true,
    };
    return inlineFields
      ? React.createElement(
          "div",
          { className: "row" },
          React.createElement(
            "div",
            { className: "col" },
            super.content(false)
          ),
          React.createElement(
            "div",
            { className: "col" },
            React.createElement(NoWrapField, { ...cloneFieldProps })
          ),
          React.createElement("div", { className: "col-12" }, children)
        )
      : React.createElement(
          React.Fragment,
          {},
          super.content(false),
          React.createElement("div", { className: dividerClasses }),
          React.createElement(NoWrapField, { ...cloneFieldProps }),
          children
        );
  }
}
