import React, { ReactNode } from "react";
import GridContainer, {
  GridContainerProps,
  GridContainerState,
} from "./grid-container";

export interface GridSwitchContainerProps extends GridContainerProps {}
export interface GridSwitchContainerState extends GridContainerState {}

/**
 * Grid container that alternates column order in a zig-zag pattern.
 */
export default class GridSwitchContainer extends GridContainer<
  GridSwitchContainerProps,
  GridSwitchContainerState
> {
  static override jsClass = "GridSwitchContainer";

  static override defaultProps = {
    ...GridContainer.defaultProps,
  };

  override content(children: any = this.props.children): any {
    if (!this.breakpoint) return this.waitBreakpoint;

    const original: any[] = React.Children.toArray(children);
    let leftChildren: any[] = [];
    let rightChildren: any[] = [];

    while (original.length) {
      leftChildren.push(original.shift(), null);
      rightChildren.push(null, original.shift());
    }

    leftChildren = this.grid(leftChildren).filter((c: any) => !!c);
    rightChildren = this.grid(rightChildren).filter((c: any) => !!c);

    let toggler = false;
    let count = 0;
    while (leftChildren.length) {
      const lc = leftChildren.shift();
      const rc = rightChildren.shift();
      if (lc) lc.key = count++;
      if (rc) rc.key = count++;

      if (toggler && rc) original.push(rc);
      if (lc) original.push(lc);
      if (!toggler && rc) original.push(rc);

      toggler = !toggler;
    }

    return original.filter((c: any) => !!c);
  }
}
