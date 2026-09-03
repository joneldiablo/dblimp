import React from "react";
import { Link } from "react-router-dom";
import { randomS4 } from "@dblimp/core";
import { Icons } from "@dblimp/icomoon";
import Navigation, { NavigationItem, NavigationProps, NavigationState } from "./navigation";

export interface CardsNavigationItem extends NavigationItem {
  label?: React.ReactNode;
  description?: React.ReactNode;
  path?: string;
  icon?: string;
  image?: string;
  title?: React.ReactNode;
  iconClasses?: string | string[];
}

export interface CardsNavigationProps extends NavigationProps<CardsNavigationItem> {
  closestId?: number | string;
  menu?: CardsNavigationItem[] | Record<string, CardsNavigationItem>;
}

export interface CardsNavigationState extends NavigationState {
  rowCols: string;
}

/**
 * Grid of navigation cards with responsive column breakpoints.
 */
export default class CardsNavigation extends Navigation<
  CardsNavigationItem,
  CardsNavigationProps,
  CardsNavigationState
> {
  static override jsClass = "CardsNavigation";

  static override defaultProps: Partial<CardsNavigationProps> = {
    ...Navigation.defaultProps,
    menu: [],
  };

  private id = randomS4();

  constructor(props: CardsNavigationProps) {
    super(props);
    this.state = {
      ...(this.state || {}),
      rowCols: " row-cols-sm-2 row-cols-lg-3 row-cols-xl-4 row-cols-xxl-5",
    };
  }

  onResize = (event: any): void => {
    const { target, width } = event;
    if (target?.id !== this.props.closestId) return;

    let rowCols = "";
    if (width >= 1400) rowCols = " row-cols-5";
    else if (width >= 1200) rowCols = " row-cols-4";
    else if (width >= 768) rowCols = " row-cols-3";
    else if (width >= 576) rowCols = " row-cols-2";
    else rowCols = "";

    this.setState({ rowCols });
  };

  override componentDidMount(): void {
    if (this.props.closestId) {
      document.addEventListener("resize", this.onResize);
    }
  }

  override componentWillUnmount(): void {
    if (this.props.closestId) {
      document.removeEventListener("resize", this.onResize);
    }
  }

  override render(): React.JSX.Element {
    const menu = this.props.menu || [];
    const entries = Array.isArray(menu)
      ? menu.map((item, i) => [String(i), item] as const)
      : Object.entries(menu);

    const rowClassName = "row g-3" + (this.state.rowCols || "");

    return (
      <div className="container-fluid p-4 nav-cards">
        <div className={rowClassName}>
          {entries.map(([key, item]) => (
            <div key={key} className="col">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title nav-item">
                    {item.icon && <Icons icon={item.icon} className="me-2" />}
                    {item.label}
                    <hr className="my-1" />
                  </h5>
                  {item.description && (
                    <p className="card-subtitle mb-2 text-muted">
                      {item.description}
                    </p>
                  )}
                  {item.path && (
                    <Link to={item.path} className="stretched-link" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}
