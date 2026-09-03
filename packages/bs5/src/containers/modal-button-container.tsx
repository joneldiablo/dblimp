import React from "react";
import { eventHandler } from "@dblimp/core";
import Component, { ComponentProps } from "../component";

export interface ModalButtonContainerProps extends ComponentProps {
  target: string;
  buttonClasses?: string;
}

export default class ModalButtonContainer extends Component<ModalButtonContainerProps> {
  static jsClass = 'ModalButtonContainer';
  static defaultProps: Partial<ModalButtonContainerProps> = {
    ...Component.defaultProps,
    buttonClasses: 'btn btn-primary',
    target: ''
  };

  onClick = () => {
    if (this.props.target) {
      eventHandler.dispatch(`update.${this.props.target}`, { open: true });
    }
  };

  content(children: React.ReactNode = this.props.children): React.ReactNode {
    return (
      <button type="button" className={this.props.buttonClasses} onClick={this.onClick}>
        {children}
      </button>
    );
  }
}
