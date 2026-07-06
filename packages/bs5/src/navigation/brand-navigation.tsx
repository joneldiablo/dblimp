import React from "react";
import { NavLink } from "react-router-dom";

import Navigation, { NavigationProps } from "./navigation";

export interface BrandNavigationProps extends NavigationProps {
  path?: string;
  logoWidth?: number;
  logoHeight?: number | string;
  exact?: boolean;
  logoSrc?: string;
  brandName?: React.ReactNode;
  logoClasses?: string;
  logoStyle?: React.CSSProperties;
  slogan?: React.ReactNode;
}

export default class BrandNavigation extends Navigation {
  static jsClass = "BrandNavigation";

  static defaultProps: Partial<BrandNavigationProps> = {
    ...Navigation.defaultProps,
    path: "/",
    logoWidth: 40,
    logoHeight: "auto",
    exact: true,
  };

  protected content(children = this.props.children): React.ReactNode {
    const {
      logoSrc,
      path,
      brandName,
      logoWidth,
      logoHeight,
      logoClasses,
      logoStyle,
      slogan,
      exact,
    } = this.props;

    const propsLogo = {
      src: logoSrc,
      alt: typeof brandName === "string" ? brandName : undefined,
      width: logoWidth,
      height: logoHeight,
      className: ["mr-2", logoClasses].flat().join(" "),
      style: logoStyle,
    };

    return (
      <>
        <NavLink className="navbar-brand" to={path!} end={exact}>
          <div className="d-flex align-items-center">
            {logoSrc && <img {...propsLogo} />}
            <div className="brand-content" style={{ lineHeight: 1 }}>
              <p className="m-0">
                <b className="brandName">{brandName}</b>
              </p>
              <p className="m-0">
                <small className="slogan">{slogan}</small>
              </p>
            </div>
          </div>
        </NavLink>
        {children}
      </>
    );
  }
}
