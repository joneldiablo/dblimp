import React from "react";

import RadioField, { RadioFieldProps, RadioFieldState } from "./radio-field";

export interface CheckboxFieldProps extends RadioFieldProps {}
export interface CheckboxFieldState extends RadioFieldState {}

export default class CheckboxField<
  TProps extends CheckboxFieldProps = CheckboxFieldProps,
  TState extends CheckboxFieldState = CheckboxFieldState
> extends RadioField<CheckboxFieldProps, CheckboxFieldState> {
  static jsClass = "CheckboxField";

  get type() {
    return "checkbox";
  }

  onChange(e: any) {
    const { checked, value, dataset } = e.target;
    const { options } = this.props;
    let { value: setValue } = this.state;
    if (Array.isArray(options)) {
      setValue = Array.isArray(setValue) ? setValue : [];
      const valueSet = new Set(setValue);
      const typeOfValue = dataset.type === "number" ? parseFloat(value) : value;
      if (checked) valueSet.add(typeOfValue);
      else valueSet.delete(typeOfValue);
      setValue = Array.from(valueSet);
    } else {
      setValue = checked;
    }
    this.setState(
      {
        value: setValue,
        error: this.isInvalid(setValue),
      },
      () => this.returnData()
    );
  }

  get inputProps() {
    const props = super.inputProps;
    props.required = this.props.required && !this.state.value.length;
    return props;
  }

  content(children = this.props.children) {
    let { options, label, disabled, readOnly, hidden, labelInline } =
      this.props;
    const hasOptions = Array.isArray(options);
    return React.createElement(
      React.Fragment,
      {},
      !!label && hasOptions && this.labelNode,
      !!label && hasOptions && !labelInline && React.createElement("br"),
      hasOptions
        ? options.map(this.nodeOption).filter((o) => !!o)
        : this.nodeOption(
            {
              disabled,
              hidden,
              label,
              readOnly,
              value: true,
            },
            0
          ),
      React.createElement(
        React.Fragment,
        {},
        this.errorMessageNode,
        this.messageNode
      ),
      children
    );
  }
}
