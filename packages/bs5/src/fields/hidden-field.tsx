import React from "react";

import Field, { FieldProps } from "./field";

export interface HiddenFieldProps extends FieldProps {}

export default class HiddenField extends Field<HiddenFieldProps> {

  static jsClass = 'HiddenField';

  get type() {
    return 'hidden';
  }

  // Renders
  render() {
    return this.inputNode;
  }

}
