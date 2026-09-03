import React, { ReactNode, CSSProperties } from "react";

export interface FlexContainerProps {
  children?: ReactNode;
  className?: string | string[];
  colClassNames?: string | string[];
  style?: CSSProperties;
}

/**
 * Flexible container distributing children with custom column classnames.
 */
export default class FlexContainer extends React.Component<FlexContainerProps> {
  static jsClass = "FlexContainer";

  static defaultProps: Partial<FlexContainerProps> = {
    className: "",
    style: {},
    colClassNames: [],
  };

  column = (child: ReactNode, i: number): React.ReactElement => {
    const { colClassNames } = this.props;
    const colcn: string[] = [];

    if (typeof colClassNames === "string") {
      colcn.push(colClassNames);
    } else if (Array.isArray(colClassNames) && colClassNames[i]) {
      colcn.push(colClassNames[i]);
    } else if (Array.isArray(colClassNames) && colClassNames.length > 0) {
      colcn.push(colClassNames[colClassNames.length - 1]);
    }

    return (
      <div className={colcn.flat().join(" ")} key={i}>
        {child}
      </div>
    );
  };

  render(): React.ReactNode {
    const { className, style, children } = this.props;
    const classList = Array.isArray(className)
      ? className
      : className
        ? [className]
        : [];
    const cn = ["FlexContainer", ...classList, "d-flex"].join(" ");

    return (
      <div className={cn} style={style}>
        {React.Children.map(children, (child, i) => this.column(child, i))}
      </div>
    );
  }
}
