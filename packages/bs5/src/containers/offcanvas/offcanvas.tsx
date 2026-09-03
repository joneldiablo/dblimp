import React, { JSX, FC, ExoticComponent } from "react";
import Offcanvas from "bootstrap/js/dist/offcanvas";

import { JsonRender } from "@dblimp/core";
import { eventHandler, resolveRefs } from "@dblimp/core";

import Component, { ComponentProps, ComponentState } from "../../component";
import schema from "./offcanvas.json";

export interface OffcanvasContainerProps extends ComponentProps {
  bodyClasses?: string | string[] | Record<string, any>;
  closeClasses?: string | string[] | Record<string, any>;
  footerClasses?: string | string[] | Record<string, any>;
  headerClasses?: string | string[] | Record<string, any>;
  labelClasses?: string | string[] | Record<string, any>;
  label?: React.ReactNode;
  labelTag?: string;
  offcanvas?: Record<string, any>;
  position?: "start" | "end" | "top" | "bottom";
  showClose?: boolean;
}

export interface OffcanvasContainerState extends ComponentState {
  showOffcanvas: boolean;
}

/**
 * OffcanvasContainer component to manage and display an offcanvas UI element.
 * @extends Component
 */
export default class OffcanvasContainer extends Component<
  OffcanvasContainerProps,
  OffcanvasContainerState
> {
  // Static property to define the class name
  static jsClass = "OffcanvasContainer";

  // Default properties for the OffcanvasContainer component
  static defaultProps: Partial<OffcanvasContainerProps> = {
    ...Component.defaultProps,
    bodyClasses: "",
    closeClasses: "",
    footerClasses: "",
    headerClasses: "",
    labelClasses: "",
    labelTag: "h5",
    offcanvas: {},
    position: "start", // Possible values: start, end, bottom, top
    showClose: true,
  };

  /**
   * HTML tagName, This variable is used by the parent Class.
   * @type {string}
   * @SuppressWarnings unused
   * @override
   */
  // NOSONAR
  tag:
    | typeof Component
    | keyof JSX.IntrinsicElements
    | FC<{}>
    | ExoticComponent<{}> = "aside";

  /**
   * CSS classes for the offcanvas container, used by the parent Class.
   * @type {string}
   * @SuppressWarnings unused
   * @override
   */
  // NOSONAR
  classes = "offcanvas d-flex flex-column";

  // Children elements categorized by type
  children = {
    header: [],
    body: [],
    footer: [],
    content: [],
  };

  bsEvents;
  schema;
  jsonRender: JsonRender;
  offcanvas?: Offcanvas | null;

  /**
   * Constructor to initialize the component with given properties.
   * @param {object} props - The properties passed to the component.
   */
  constructor(props: OffcanvasContainerProps) {
    super(props);
    this.onOffcanvasRef = this.onOffcanvasRef.bind(this);

    // Bootstrap events to manage offcanvas lifecycle
    this.bsEvents = ["show", "shown", "hide", "hidden", "hidePrevented"];

    // Initial state
    Object.assign(this.state, {
      showOffcanvas: false,
      localClasses: "offcanvas-" + props.position,
    });

    // Resolve schema references and initialize JsonRender
    this.schema = resolveRefs(schema.view, {
      definitions: schema.definitions,
      props,
    });
    this.jsonRender = new JsonRender(props, this.mutations.bind(this));
  }

  /**
   * Override componentProps to include necessary attributes and refs. Used by the parent Class.
   * @override
   * @SuppressWarnings unused
   */
  get componentProps() {
    const props = this.props._props || {};
    return {
      tabIndex: -1,
      id: this.name,
      "aria-labelledby": this.props.name + "-titleOffcanvas",
      ref: this.onOffcanvasRef,
      ...props,
    };
  }

  // Lifecycle method: componentDidMount
  componentDidMount() {
    const { name } = this.props;
    eventHandler.subscribe("update." + name, this.onUpdateOffcanvas, this.name);
    this.deleteClasses(
      "offcanvas-start offcanvas-end offcanvas-top offcanvas-bottom"
    );
    this.addClasses("offcanvas-" + this.props.position);
  }

  // Lifecycle method: componentWillUnmount
  componentWillUnmount() {
    const { name } = this.props;
    this.destroy();
    eventHandler.unsubscribe("update." + name, this.name);
  }

  /**
   * Event handler for offcanvas events.
   * @param {Event} e - The event object.
   */
  onEvent = (e: Event) => {
    const { name } = this.props;
    eventHandler.dispatch(name, { [name]: e.type.split(".")[0] });
  };

  /**
   * Event handler for updating the offcanvas visibility.
   * @param {object} param - The update parameters.
   * @param {boolean} param.open - Whether to show or hide the offcanvas.
   */
  onUpdateOffcanvas = ({ open: showOffcanvas }: { open: boolean }) => {
    if (!showOffcanvas) {
      return this.offcanvas?.hide();
    }
    this.setState({ showOffcanvas });
  };

  /**
   * Destroy the offcanvas instance.
   */
  destroy = () => {
    if (this.offcanvas) {
      this.offcanvas.dispose();
      this.offcanvas = null;
    }
    this.setState({ showOffcanvas: false });
  };

  /**
   * Callback to initialize the offcanvas reference.
   * @param {HTMLElement} refOriginal - The original reference element.
   */
  onOffcanvasRef = (refOriginal: any) => {
    if (refOriginal) {
      this.ref.current = refOriginal;
      const ref = refOriginal;

      this.offcanvas = new Offcanvas(ref, this.props.offcanvas);
      this.bsEvents.forEach((event) => {
        ref.addEventListener(event + ".bs.offcanvas", this.onEvent, false);
      });
      ref.addEventListener("hidden.bs.offcanvas", this.destroy, false);
      this.offcanvas.show();
    }
  };

  /**
   * Get the header content.
   * @returns {Array} - The header content.
   */
  get headerContent() {
    return !!this.children.header.length && this.children.header;
  }

  /**
   * Get the body content.
   * @returns {Array} - The body content.
   */
  get bodyContent() {
    return !!this.children.body.length && this.children.body;
  }

  /**
   * Get the footer content.
   * @returns {Array} - The footer content.
   */
  get footerContent() {
    return !!this.children.footer.length && this.children.footer;
  }

  /**
   * Get the content for the offcanvas.
   * @returns {Array} - The offcanvas content.
   */
  get contentOffcanvas() {
    return !!this.children.content.length && this.children.content;
  }

  /**
   * Method to categorize and render children elements. Used by the parent Class
   * @override
   * @param {Array|object} children - The children elements to categorize and render.
   * @SuppressWarnings unused
   * @returns {JSX.Element} - The rendered content.
   */
  content(children = this.props.children) {
    this.children = (Array.isArray(children) ? children : [children]).reduce(
      (reducer, child) => {
        if (!child) return reducer;
        // Categorize content based on type: header, body, footer, or general content
        if (["string", "number", "boolean"].includes(typeof child)) {
          reducer.body.push(child);
          return reducer;
        }
        const childCondition = !child.props?.style?.["--component-name"];
        const childConf = (childCondition ? child : child.props.children).props;
        const container =
          (childConf && reducer[childConf.container]) || reducer.content;
        container.push(child);
        return reducer;
      },
      { header: [], body: [], footer: [], content: [] }
    );
    return this.jsonRender.buildContent(this.schema);
  }

  /**
   * Render the offcanvas container.
   * @returns {JSX.Element} - The rendered offcanvas container.
   */
  render() {
    return this.state.showOffcanvas
      ? super.render()
      : React.createElement(React.Fragment);
  }

  /**
   * Function to apply specific mutations based on the name and configuration.
   * @param {string} name - The name to determine which mutation to apply.
   * @param {object} conf - The configuration object for the mutation.
   * @returns {(boolean|object)} - Returns an object with mutation properties or false if no mutation is applied.
   */
  mutations(name: string, conf: Record<string, any>) {
    const rn = name.replace(this.props.name + "-", "");
    switch (rn) {
      case "headerOffcanvas": {
        return {
          active:
            this.props.showClose || !!this.props.label || !!this.headerContent,
          classes: [conf.classes, this.props.headerClasses],
        };
      }
      case "titleOffcanvas": {
        return {
          active: !!this.props.label,
          tag: this.props.labelTag,
          classes: [conf.classes, this.props.labelClasses],
          content: this.props.label,
        };
      }
      case "closeOffcanvas": {
        return {
          active: this.props.showClose,
          classes: [conf.classes, this.props.closeClasses],
        };
      }
      case "contentHO": {
        return {
          active: !!this.headerContent,
          tag: React.Fragment,
          content: this.headerContent,
        };
      }
      case "bodyOffcanvas": {
        return {
          active: !!this.bodyContent,
          classes: [conf.classes, this.props.bodyClasses],
          content: this.bodyContent,
        };
      }
      case "footerOffcanvas": {
        return {
          active: !!this.footerContent,
          classes: [conf.classes, this.props.footerClasses],
          content: this.footerContent,
        };
      }
      case "contentOffcanvas": {
        return {
          active: !!this.contentOffcanvas,
          tag: React.Fragment,
          content: this.contentOffcanvas,
        };
      }
      default:
        break;
    }
    return false;
  }
}
