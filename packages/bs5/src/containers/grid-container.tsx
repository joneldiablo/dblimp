import React from "react";
import Container from "./container";

export interface GridContainerProps {
  rowClasses?: string;
  colClasses?: string;
}

export default class GridContainer extends Container<GridContainerProps> {
  static jsClass = 'GridContainer';
  static defaultProps: Partial<GridContainerProps> = {
    ...Container.defaultProps,
    rowClasses: 'row',
    colClasses: 'col'
  };

  content(children: React.ReactNode = this.props.children): React.ReactNode {
    const { rowClasses, colClasses } = this.props;
    return (
      <div className={rowClasses}>
        {React.Children.map(children, (child, i) => (
          <div className={colClasses} key={i}>{child}</div>
        ))}
      </div>
    );
  }
}
