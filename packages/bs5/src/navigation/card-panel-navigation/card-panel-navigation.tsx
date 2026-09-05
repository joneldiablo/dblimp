import {
  JsonRenderComponent,
  JsonRenderComponentProps,
  JsonRenderComponentState,
} from "@dblimp/core";

import schema from "./card-panel-navigation.json";
import "./style.scss";

export interface CardPanelNavigationProps extends JsonRenderComponentProps {
  location: any;
  basePath: string;
}

export interface CardPanelNavigationState extends JsonRenderComponentState {
  size: any;
}

/**
 * Navigation panel rendering cards or route panels depending on active path and breakpoint.
 */
export default class CardPanelNavigation extends JsonRenderComponent<
  CardPanelNavigationProps,
  CardPanelNavigationState
> {
  static override jsClass = "CardPanelNavigation";
  static override template = schema as any;
  static slots = [];
  static override defaultProps: Partial<CardPanelNavigationProps> = {
    ...JsonRenderComponent.defaultProps,
    childrenIn: false,
  };

  constructor(props: CardPanelNavigationProps) {
    super(props);
    this.events.push([
      `resize.${props.name}-container`,
      this.onResize.bind(this),
    ]);
    this.state = {
      ...(this.state || {}),
      size: {},
    };
  }

  get childrenIn(): any {
    return [this.props.name, "children"].join("-");
  }

  onResize(data: any): void {
    this.setState({ size: data });
  }

  override mutations(name: string, conf: any): any {
    const id = name.split("-").slice(1).join("-");
    switch (id) {
      case "listCards": {
        return {
          active: this.props.basePath === this.props.location?.pathname,
        };
      }
      case "panelRoutes": {
        return {
          active: this.props.basePath !== this.props.location?.pathname,
        };
      }
      case "listNav": {
        return {
          active: !["xs", "sm", "md"].includes(this.state?.size?.breakpoint),
        };
      }
      default:
        break;
    }
    return super.mutations(name, conf);
  }
}