import React from "react";

import Field, { FieldProps } from "./field";

export interface NoWrapFieldProps extends FieldProps {}

export default class NoWrapField extends Field<NoWrapFieldProps> {

  static jsClass = 'NoWrapField';

  ContentWrap = React.Fragment;

  render() {
    return this.content();
  }};