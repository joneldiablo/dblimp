import { resolveRefs, eventHandler } from "@dblimp/core";
import Component, { ComponentProps } from "@dblimp/core/component";
import Goat from "@dblimp/core/goat";


interface ActionComponentProps extends ComponentProps {
  classButton?: boolean;
  close?: string | boolean;
  disabled?: boolean;
  form?: string;
  hash?: string;
  icon?: string | boolean;
  iconClasses?: string;
  iconProps?: Record<string, any>;
  id?: string | number;
  open?: string | boolean;
  search?: string;
  status?: string | boolean;
  statusClasses?: Record<string, string>;
  statusIcons?: Record<string, string>;
  navOptions?: Record<string, any>;
  to?: string | number;
  type?: string;
  value?: any;
  justifyContent?: "start" | "center" | "end";
}

export default class ActionComponent extends Component<ActionComponentProps> {
  static jsClass = "Action";

  static defaultProps: Partial<ActionComponentProps> = {
    ...Component.defaultProps,
    type: "button",
    classButton: true,
    open: false,
    close: false,
    statusIcons: {
      success: "check",
      error: "x",
      warning: "exclamation",
      loading: "spinner",
    },
    statusClasses: {
      success: "text-bold text-success",
      error: "text-bold text-danger",
      warning: "text-bold text-warning",
      loading: "spinner",
    },
    iconClasses: "",
    iconProps: {},
    justifyContent: "center",
  };

  static schemaContent = {
    actionIcon: {
      name: ["$props/name", "actionIcon"],
      component: "Icons",
      icon: "$props/icon",
      style: {
        width: "var(--bs-btn-font-size)",
      },
    },
    actionContent: {
      name: ["$props/name", "actionContent"],
      tag: "span",
    },
    actionStatus: {
      name: ["$props/name", "actionStatus"],
      component: "Icons",
      icon: "$state/status",
      classes: "float-end",
    },
  };

  protected tag: any = "button";
  protected classes = "d-inline-flex align-items-center";
  protected schema;
  protected goat;

  constructor(props: ActionComponentProps) {
    super(props);
    this.classes += " justify-content-" + props.justifyContent;
    this.onClick = this.onClick.bind(this);
    Object.assign(this.state, {
      localClasses: props.classButton ? "btn" : "",
    });
    this.eventHandlers.onClick = this.onClick;
    this.schema = resolveRefs(ActionComponent.schemaContent, { props });
    this.goat = new Goat({ ...props }, this.mutations.bind(this));
  }

  protected onClick(e: any) {
    e.stopPropagation();
    const {
      navigate,
      to,
      search,
      hash,
      navOptions = {},
      type,
      open,
      close,
      value,
      name,
      id,
    } = this.props;

    if (type === "link" && to) {
      if (typeof to === "number") navigate(to);
      else {
        navigate(
          { pathname: to, search, hash },
          { ...navOptions, state: { name, id, value } }
        );
      }
    }

    if (open) {
      eventHandler.dispatch(`update.${open}`, { open: true });
    }
    if (close) {
      eventHandler.dispatch(`update.${close}`, { open: false });
    }

    let dispatch: any = name;
    if (value || id) {
      dispatch = { [name]: value, id };
    }
    eventHandler.dispatch(name, dispatch);
  }

  protected get componentProps(): Record<string, any> {
    const { type: prevType, disabled, form, _props = {} } = this.props;
    const type = prevType === "link" ? "button" : prevType;
    return { type, disabled, ..._props, form: form ? `${form}-form` : undefined };
  }

  protected content(): React.ReactNode {
    return this.goat.buildContent(this.schema);
  }

  protected mutations(name: string, config: Record<string, any>) {
    const search = name.replace(`${this.props.name}-`, "");
    switch (search) {
      case "actionIcon": {
        const cn: string[] = [];
        if (this.props.children) cn.push("me-2");
        return {
          ...this.props.iconProps,
          active: !!this.props.icon,
          icon: this.props.icon,
          classes: [cn, this.props.iconClasses].flat().join(" "),
        };
      }
      case "actionStatus": {
        const classes = [config.classes, this.props.statusClasses?.[this.props.status as string]];
        if (this.props.icon || this.props.children) classes.push("ms-2");
        return {
          active: !!this.props.status,
          icon: this.props.statusIcons?.[this.props.status as string],
          classes,
        };
      }
      case "actionContent": {
        return {
          active: !!this.props.children,
          content: this.props.children,
        };
      }
      default:
        return {};
    }
  }
}
