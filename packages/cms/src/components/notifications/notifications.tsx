import { eventHandler } from "@dblimp/core";
import GoatComponent, {
  GoatComponentProps,
} from "@dblimp/core/goat-component";

import schema from "./notifications.json";

import "./style.scss";

export interface NotificationsProps extends GoatComponentProps {
  open: boolean;
  type?:
    | "info"
    | "success"
    | "warning"
    | "danger"
    | "primary"
    | "secondary"
    | "light"
    | "dark";
  otherType?: string;
  tagLabel?: string;
  icon?: string;
  labelError?: string;
  error?: any;
}

export default class Notifications extends GoatComponent<NotificationsProps> {
  static jsClass = "Notifications";
  static template = schema;
  static slots: string[] = [];
  static defaultProps = {
    ...GoatComponent.defaultProps,
    childrenIn: undefined,
    open: true,
    tagLabel: "h4",
    labelError: "Error",
  };

  classes = ["alert alert-dismissible fade"];
  style = {};

  constructor(props: NotificationsProps) {
    super(props);
    this.classes.push(`alert-${props.type || props.otherType || "info"}`);
    Object.assign(this.state, {
      classes: (props.open as any) ?? "show",
    });
    this.events.push([props.name + "-closeButton", this.onClose.bind(this)]);
  }

  protected get componentProps(): Record<string, any> | undefined {
    return {
      ...super["componentProps"],
      role: "alert",
    };
  }

  get childrenIn() {
    return [this.props.name, "childrenHere"].join("-");
  }

  onClose() {
    eventHandler.dispatch(this.props.name, { open: false });
  }

  mutations(name: string, conf: any) {
    const id = name.split("-").slice(1).join("-");
    switch (id) {
      case "label": {
        return {
          active: !!this.props.label,
          content: [conf.content[0], this.props.label],
        };
      }
      case "labelIcon": {
        return {
          active: !!(this.props.label && this.props.icon),
          icon: this.props.icon,
          inline: true,
          classes: ["me-2"],
          style: { marginBottom: 1 },
        };
      }
      case "contentIcon": {
        return {
          active: !!(!this.props.label && this.props.icon),
          icon: this.props.icon,
        };
      }
      case "errorLine": {
        return {
          active: !!this.props.error,
        };
      }
      case "errorDetails": {
        return {
          active: !!this.props.error,
          content:
            this.props.error ?? JSON.stringify(this.props.error, null, 2),
        };
      }
      default:
        break;
    }
    return super.mutations(name, conf);
  }
}