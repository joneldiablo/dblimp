import { Location } from "react-router";

import JsonRenderComponent, {
  JsonRenderComponentProps,
} from "@dblimp/core/json-render-component";

import { findScrollableParent } from "../../utils/find-scrollable-parent";
import schema from "./card-panel-navigation.json";
import "./style.scss";

export interface CardPanelNavigationProps extends JsonRenderComponentProps {
  location: any;
  basePath: string;
}

export default class CardPanelNavigation extends JsonRenderComponent<CardPanelNavigationProps> {
  static jsClass = "CardPanelNavigation";
  static template = schema;
  static slots: string[] = [];
  static defaultProps = {
    ...JsonRenderComponent.defaultProps,
    childrenIn: undefined,
  };

  style = {};

  constructor(props: CardPanelNavigationProps) {
    super(props);
    this.events.push(
      [`resize.${props.name}-container`, this.onResize.bind(this)],
      [`location`, this.onChangeLocation.bind(this)],
      ["location", this.onLocationChange.bind(this)]
    );
    Object.assign(this.state, {
      size: {},
      location: this.props.location,
    });
  }

  get childrenIn() {
    return [this.props.name, "children"].join("-");
  }

  onLocationChange() {
    this.evalTemplate();
    this.forceUpdate();
    const sc = findScrollableParent(this.ref.current);
    if (sc) sc.scrollTo(0, 0);
  }

  onResize(data: any) {
    this.setState({ size: data });
  }

  onChangeLocation(location: Location) {
    this.setState({ location });
  }

  mutations(name: string, conf: any) {
    const id = name.split("-").slice(1).join("-");
    switch (id) {
      case "listCards": {
        return {
          active: this.props.basePath === this.state.location.pathname,
        };
      }
      case "panelRoutes": {
        return {
          active: this.props.basePath !== this.state.location.pathname,
        };
      }
      case "listNav": {
        return {
          active: !["xs", "sm", "md"].includes(this.state.size.breakpoint),
        };
      }
      default:
        break;
    }
    return super.mutations(name, conf);
  }
}