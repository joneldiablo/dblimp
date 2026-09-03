import React, { ComponentType } from "react";

import Image, { ImageProps } from "@dblimp/core/media/image";

import { resolveSrc } from "../utils/assets";

/**
 * Higher-order component that rewrites `/assets` URLs based on the current
 * environment so the wrapped `Image` component can be reused transparently in
 * dev and prod.
 */
const withSrc = <P extends ImageProps>(Component: ComponentType<P>) => {
  const WithSrc = (props: P) => {
    const rewrittenSrc = resolveSrc(props.src ?? null);
    if (rewrittenSrc === props.src) {
      return <Component {...props} />;
    }
    return <Component {...props} src={rewrittenSrc} />;
  };

  WithSrc.displayName = `WithSrc(${Component.displayName || Component.name || "Component"})`;

  Object.assign(WithSrc, Component);

  return WithSrc as typeof Component;
};

export default withSrc(Image);