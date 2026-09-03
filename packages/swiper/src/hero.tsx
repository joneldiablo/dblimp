import React, { ReactNode, CSSProperties } from "react";

export interface HeroProps {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

/**
 * Fullscreen hero slide item for Swiper banners.
 */
export default class Hero extends React.Component<HeroProps> {
  static jsClass = "Hero";

  render(): React.ReactNode {
    const { style, children, className } = this.props;
    return (
      <div className={className} style={{ height: "100vh", ...style }}>
        {children}
      </div>
    );
  }
}
