import React from "react";

import { extractNodeString } from "dbl-utils/extract-react-node-text";

import Field from "./field";

export default class SelectField extends Field {
  static jsClass = "SelectField";

  onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as unknown as HTMLSelectElement;
    let { value } = target;
    const opt = this.props.options!.find((opt) => opt.value == value);
    this.setState(
      {
        value,
        error: this.isInvalid(value),
      },
      () => this.returnData(opt ? opt.value : value, { option: opt })
    );
  };

  get inputProps() {
    const props = super.inputProps;
    delete props.placeholder;
    delete props.type;
    props.className = props.className.replace("form-control", "form-select");
    return props;
  }

  get inputNode() {
    const { placeholder, options, label, floating } = this.props;
    const inputNode = React.createElement(
      "select",
      { ...this.inputProps },
      placeholder &&
        (label || !floating) &&
        React.createElement(
          "option",
          { value: "" },
          extractNodeString(placeholder)
        ),
      placeholder &&
        (label || !floating) &&
        React.createElement("option", { disabled: true }, "──────────"),
      Array.isArray(options) &&
        options
          .map((opt) => {
            if (!opt) return false;

            const modify =
              typeof this.props.mutations === "function" &&
              this.props.mutations(`${this.props.name}.${opt.value}`, opt);
            const { active, disabled, label, value, title } = Object.assign(
              {},
              opt,
              modify || {}
            );
            if (active === false) return false;

            let propsOpt = {
              value,
              disabled,
              title,
            };
            return React.createElement(
              "option",
              { key: value, ...propsOpt },
              label
            );
          })
          .filter((o) => !!o)
    );
    return inputNode;
  }
}
