import React from "react";
import Container from "./container";

export interface ScrollContainerProps {
  classes?: string;
  style?: React.CSSProperties;
}

export default class ScrollContainer extends Container<ScrollContainerProps> {
  static jsClass = 'ScrollContainer';
  static defaultProps: Partial<ScrollContainerProps> = {
    ...Container.defaultProps,
    classes: 'overflow-auto',
    style: { maxHeight: '100%' }
  };

  content(children: React.ReactNode = this.props.children): React.ReactNode {
    const { classes, style } = this.props;
    return (
      <div className={classes} style={style}>
        {children}
      </div>
    );
  }
}
