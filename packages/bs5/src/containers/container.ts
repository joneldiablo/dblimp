import React from "react";
import { eventHandler } from "@dblimp/core";
import Component, { ComponentProps, ComponentState } from "../component";
import Icons from "@dblimp/icomoon";

const defaultBreakpoints: Record<string, number> = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1400,
};

export default class Container<
  TProps extends ComponentProps = ComponentProps,
  TState extends ComponentState = ComponentState
> extends Component<TProps, TState> {
  static jsClass = "Container";
  static defaultProps: Partial<ComponentProps> & {
    breakpoints?: Record<string, number>;
  } = {
    ...Component.defaultProps,
    breakpoints: defaultBreakpoints,
  };

  protected breakpoint: string | false = false;
  protected orientation: "landscape" | "portrait" | false = false;
  protected width = 0;
  protected height = 0;
  protected onResizeTimeout?: ReturnType<typeof setTimeout>;
  protected waitBreakpoint: React.ReactNode = React.createElement(Icons, {
    icon: "spinner",
    classes: "spinner",
  });

  constructor(props: TProps) {
    super(props);
    this.onResize = this.onResize.bind(this);
  }

  updateSize(): void {
    const { fluid, fullWidth, breakpoints } = this.props as ComponentProps & {
      fluid?: boolean;
      fullWidth?: boolean;
      breakpoints?: Record<string, number>;
    };
    const containerType = !fullWidth
      ? fluid
        ? "container-fluid"
        : "container"
      : "";
    const localClasses = new Set(this.state.localClasses.split(" "));
    Object.keys(breakpoints ?? {}).forEach((br) =>
      localClasses.delete(br)
    );
    [containerType, this.breakpoint, "animate"].filter(Boolean).forEach((c) =>
      localClasses.add(c as string)
    );
    this.state.localClasses = Array.from(localClasses).flat().join(" ");
    if (!this.addClasses(this.props[this.breakpoint + "Classes"])) {
      this.setState({
        localClasses: this.state.localClasses,
      });
    }
  }

  onResize(firstTime?: boolean | { width: number; height: number }): void {
    const resizingFunc = () => {
      if (!this.ref.current) return;

      let width: number;
      let height: number;
      if (firstTime === true) {
        const el = this.ref.current as HTMLElement;
        width = el.offsetWidth;
        height = el.offsetHeight;
      } else {
        ({ width, height } = firstTime as { width: number; height: number });
      }

      const { breakpoints } = this.props as unknown as {
        breakpoints: Record<string, number>;
      };
      this.breakpoint = Object.keys(breakpoints)
        .filter((br) => width >= breakpoints[br])
        .pop() as string;
      this.orientation = width >= height ? "landscape" : "portrait";
      this.width = width;
      this.height = height;
      const resp = {
        width,
        height,
        breakpoint: this.breakpoint,
        orientation: this.orientation,
      };

      if (typeof this.props.onResize === "function") {
        (this.props as ComponentProps & {
          onResize?: (r: typeof resp) => void;
        }).onResize?.(resp);
      }
      eventHandler.dispatch("resize." + this.props.name, resp);
      this.updateSize();
    };

    if (firstTime === true) {
      resizingFunc();
      eventHandler.dispatch("ready." + this.props.name);
    } else {
      clearTimeout(this.onResizeTimeout);
      this.onResizeTimeout = setTimeout(resizingFunc, 200);
    }
  }

  protected onWindowResize = (): void => {
    this.onResize({ width: window.innerWidth, height: window.innerHeight });
  };

  componentDidMount(): void {
    this.onResize(true);
    window.addEventListener("resize", this.onWindowResize);
  }

  componentDidUpdate(prevProps: TProps): void {
    const p = prevProps as ComponentProps & {
      fluid?: boolean;
      fullWidth?: boolean;
    };
    const n = this.props as ComponentProps & {
      fluid?: boolean;
      fullWidth?: boolean;
    };
    if (p.fluid !== n.fluid || p.fullWidth !== n.fullWidth) {
      this.updateSize();
    }
  }

  componentWillUnmount(): void {
    clearTimeout(this.onResizeTimeout);
    window.removeEventListener("resize", this.onWindowResize);
  }

  content(children: React.ReactNode = this.props.children): React.ReactNode {
    return !!this.breakpoint ? children : this.waitBreakpoint;
  }
}