import React, { createRef } from "react";
import moment from "moment";

import Field, { FieldProps } from "./field";

export default class DateRangeField extends Field {

  static jsClass = 'DateRangeField';
  static defaultProps = {
    ...Field.defaultProps,
    default: ['', '']
  };

  inputEnd = createRef<HTMLInputElement>();

  constructor(props: FieldProps) {
    super(props);
  }

  isInvalid(value: any) {
    let error = super.isInvalid(value);
    this.inputEnd.current?.setCustomValidity('');
    const isAfter = moment(value[0]).isAfter(value[1]);
    if (isAfter) this.inputEnd.current?.setCustomValidity(this.props.errorMessage as string);
    return (error || isAfter);
  }

  get type() {
    return 'date';
  }

  onChange({ target }: React.ChangeEvent<HTMLInputElement>) {
    const { name } = this.props;
    const { value } = this.state as { value: any[] };
    const { value: newValue } = target;
    const i = target.name === name ? 0 : 1;
    value[i] = newValue;
    this.setState({
      value,
      error: this.isInvalid(value)
    }, () => { if (value.every(v => !!v)) this.returnData() });
  }

  get inputNode() {
    const { inline } = this.props;
    const { error } = this.state;
    const inputProps = this.inputProps as Record<string, any>;
    const cnMiddle = ['input-group-text bg-transparent p-0', this.props.controlClasses];
    if (error) cnMiddle.push('border-danger');
    const style = {
      ...inputProps.style,
      borderRight: 'none',
    }
    const style2 = {
      ...inputProps.style,
      borderLeft: 'none',
    }
    const inputNode = (React.createElement('div',
      { className: "input-group" },
      React.createElement('input', { ...inputProps, style, value: inputProps.value[0] }),
      React.createElement('span', { className: cnMiddle.flat().join(' ') }, '-'),
      React.createElement('input',
        {
          ...inputProps,
          name: inputProps.name + '-end',
          ref: this.inputEnd,
          id: inputProps.name + '-end',
          style: style2, value: inputProps.value[1]
        })
    ));
    return (inline
      ? React.createElement('div', { className: "col-auto" }, inputNode)
      : inputNode);
  }

}
