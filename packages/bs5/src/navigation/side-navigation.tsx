import React from "react";
import { NavLink } from "react-router-dom";

import Icons from "@dblimp/icomoon";

export interface SideNavigationItem {
  path: string;
  icon?: string;
  label: React.ReactNode;
  exact?: boolean;
}

export interface SideNavigationProps {
  className?: string;
  iconSize?: number;
  menu?: SideNavigationItem[];
  style?: React.CSSProperties;
}

interface SideNavigationState {
  stick: boolean;
  icon: string;
}

export default class SideNavigation extends React.Component<
  SideNavigationProps,
  SideNavigationState
> {
  static jsClass = "SideNavigation";

  static defaultProps: Partial<SideNavigationProps> = {
    className: "",
    style: {},
    menu: [],
    iconSize: 40,
  };

  state: SideNavigationState = {
    stick: false,
    icon: "chevron-right",
  };

  stick = (): void => {
    this.setState(
      {
        stick: !this.state.stick,
        icon: this.state.stick ? "chevron-right" : "thumb-tack",
      },
      () => window.focus()
    );
  };

  render(): React.ReactNode {
    const { menu, iconSize, className, style } = this.props;
    const { stick, icon } = this.state;
    const cn = [SideNavigation.jsClass, className];
    if (stick) cn.push("stick");
    return (
      <div className={cn.filter(Boolean).join(" ")} style={style}>
        <ul className="nav flex-column">
          <li className="nav-item">
            <div className="nav-link clearfix px-0">
              <div
                style={{ width: iconSize, height: iconSize }}
                className="d-flex justify-content-end align-items-center float-right"
              >
                <span className="wrap-collapse-arrow" style={{ cursor: "pointer" }} onClick={this.stick}>
                  <Icons icon={icon} className="collapse-arrow" />
                </span>
              </div>
            </div>
          </li>
          {menu?.map((item, i) => (
            <li className="nav-item" key={i}>
              <NavLink to={item.path} className="nav-link" end={item.exact}>
                <Icons icon={item.icon} inline={false} width={iconSize} height={iconSize} />
                <span className="text-collapse">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}