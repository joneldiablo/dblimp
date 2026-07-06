import JsonComponent, { JrcProps } from "dbl-components/lib/js/json-render-component";

import schema from "./card-panel-navigation.json";
import "./style.scss";
import { resolveRefs } from "dbl-utils";

export interface CardPanelNavigationProps extends JrcProps {
  location: any;
  basePath: string;
}

export default class CardPanelNavigation extends JsonComponent<CardPanelNavigationProps> {

  static jsClass = "CardPanelNavigation";
  static template = schema;
  static slots = [];
  static defaultProps = {
    ...JsonComponent.defaultProps,
    childrenIn: undefined,
  }

  style = {

  }

  constructor(props: CardPanelNavigationProps) {
    super(props);
    this.events.push(
      [`resize.${props.name}-container`, this.onResize.bind(this)],
    );
    Object.assign(this.state, {
      size: {}
    });
  }

  get childrenIn() {
    return [
      this.props.name,
      "children"
    ].join('-');
  }

  onResize(data: any) {
    this.setState({ size: data });
  }

  mutations(name: string, conf: any) {
    const id = name.split('-').slice(1).join('-');
    switch (id) {
      case 'listCards': {
        return {
          active: this.props.basePath === this.props.location.pathname,
        }
      }
      case 'panelRoutes': {
        return {
          active: this.props.basePath !== this.props.location.pathname,
        }
      }
      case 'listNav': {
        return {
          active: !['xs', 'sm', 'md'].includes(this.state.size.breakpoint),
        }
      }
      default:
        break;
    }
    return super.mutations(name, conf);
  }
}