import React from "react";
import * as reactKonva from "react-konva";
import Trapezoid from "./trapezoid";

export { default as Trapezoid } from "./trapezoid";
export type { TrapezoidProps, TrapezoidState } from "./trapezoid";

export const kComponents: Record<string, any> = {
  Trapezoid,
};

Object.keys(reactKonva).forEach((k) => {
  if (/^[A-Z]/.test(k)) {
    const Component = (reactKonva as any)[k];
    if (typeof Component === "function" || typeof Component === "object") {
      const KonvaWrapper: any = React.forwardRef((props: any, ref) => {
        const {
          active: visible,
          name: id,
          classes,
          _props = {},
          ...konvaProps
        } = props;
        const name = !Array.isArray(classes) ? classes : classes.join(" ");

        Object.assign(konvaProps, _props, { id, name, ref, visible });
        return React.createElement(Component, konvaProps);
      });
      KonvaWrapper.wrapper = false;
      kComponents[k + "Konva"] = KonvaWrapper;
    }
  }
});

export default kComponents;
