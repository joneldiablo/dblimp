import React from "react";
import { Link } from "react-router-dom";
import { Icons } from "@dblimp/icomoon";
import Navigation, { NavigationProps, NavigationState } from "./navigation";

export interface CardListNavigationItem {
  label?: React.ReactNode;
  description?: React.ReactNode;
  path?: string;
  icon?: string;
  image?: string;
}

export interface CardListNavigationProps extends NavigationProps {
  menu?: CardListNavigationItem[] | Record<string, CardListNavigationItem>;
  viewType?: "list" | "cards";
}

export interface CardListNavigationState extends NavigationState {
  type: "list" | "cards";
}

/**
 * Navigation component that renders menu items as either a Bootstrap list or cards grid.
 */
export default class CardListNavigation extends Navigation<
  CardListNavigationProps,
  CardListNavigationState
> {
  static override jsClass = "CardListNavigation";

  static override defaultProps: Partial<CardListNavigationProps> = {
    ...Navigation.defaultProps,
    menu: [],
    viewType: "list",
  };

  constructor(props: CardListNavigationProps) {
    super(props);
    this.state = {
      ...(this.state || {}),
      type: props.viewType || "list",
    };
  }

  getAsCards(): React.ReactNode {
    const menu = this.props.menu || [];
    const entries = Array.isArray(menu)
      ? menu.map((item, i) => [String(i), item] as const)
      : Object.entries(menu);

    return (
      <div className="container-fluid p-4">
        <div className="row gx-3">
          {entries.map(([key, item]) => (
            <div className="col-12 col-sm-auto mb-3" key={key}>
              <div
                className="card h-100"
                style={
                  item.image
                    ? { backgroundImage: `url(${item.image})`, backgroundSize: "cover" }
                    : undefined
                }
              >
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

  getAsList(): React.ReactNode {
    const menu = this.props.menu || [];
    const entries = Array.isArray(menu)
      ? menu.map((item, i) => [String(i), item] as const)
      : Object.entries(menu);

    return (
      <ul className="list-group list-group-flush">
        {entries.map(([key, item]) => (
          <li key={key} className="list-group-item">
            {item.path ? (
              <Link
                to={item.path}
                className="list-group-item-action text-decoration-none d-flex justify-content-between align-items-center"
              >
                <span>
                  {item.icon && <Icons icon={item.icon} className="me-2" />}
                  {item.label}
                </span>
                <Icons icon="chevron-right" className="small" />
              </Link>
            ) : (
              <span>
                {item.icon && <Icons icon={item.icon} className="me-2" />}
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ul>
    );
  }

  override render(): React.ReactNode {
    return this.state.type === "list" ? this.getAsList() : this.getAsCards();
  }
}
