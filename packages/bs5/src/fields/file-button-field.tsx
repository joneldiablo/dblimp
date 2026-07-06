import React, { Component, JSX, FC, ExoticComponent } from "react";

import DropFileField, {
  DropFileFieldProps,
  DropFileFieldState,
} from "./drop-file-field";

export interface FileButtonFieldProps extends DropFileFieldProps {}
export interface FileButtonFieldState extends DropFileFieldState {}

export default class FileButtonField extends DropFileField {
  static jsClass = "FileButtonField";
  static defaultProps: Partial<FileButtonFieldProps> = {
    ...DropFileField.defaultProps,
    labelClasses: "mb-0",
  };

  tag:
    | typeof Component
    | keyof JSX.IntrinsicElements
    | FC<{}>
    | ExoticComponent<{}> = "span";

  constructor(props: FileButtonFieldProps) {
    super(props);
    this.state = this.state as DropFileFieldState;
    Object.assign(this.state, {
      localClasses: "btn position-relative",
    });
  }

  content(children = this.props.children): any {
    const { value } = this.state;
    return React.createElement(
      React.Fragment,
      {},
      this.labelNode,
      children && (!value ? children[0] : children[1]),
      this.inputNode
    );
  }

  render() {
    return React.createElement(
      React.Fragment,
      {},
      super.render(),
      this.errorMessageNode
    );
  }
}
