import React from "react";
import Container from "./container";
import { ComponentProps } from "../component";

export interface FooterContainerProps extends ComponentProps {
  classes?: string;
}

export default class FooterContainer extends Container<FooterContainerProps> {
  static jsClass = 'FooterContainer';
  static defaultProps: Partial<FooterContainerProps> = {
    ...Container.defaultProps,
    classes: 'footer bg-light py-3'
  };

  tag: keyof React.JSX.IntrinsicElements = 'footer';

  content(children: React.ReactNode = this.props.children): React.ReactNode {
    return <div className={this.props.classes}>{children}</div>;
  }
}
