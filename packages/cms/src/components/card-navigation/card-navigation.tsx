import { deepMerge, resolveRefs } from "@dblimp/core";
import GoatComponent, {
  GoatComponentProps,
  GoatComponentState,
} from "@dblimp/core/goat-component";

import { resolveSrc } from "../../utils/assets";

import "./style.scss";

import schema from "./card-navigation.json";

export interface CardNavigationProps extends GoatComponentProps {
  title: any;
  description: any;
  imageSrc: string | string[];
  backgroundImageSrc: string;
  menu: any[];
  cardClasses: string | string[];
  iconClasses: string | string[];
  labelClasses: string | string[];
}

export interface CardNavigationState extends GoatComponentState {
  menuLinksCards: string[];
}

export default class CardNavigation extends GoatComponent<
  CardNavigationProps,
  CardNavigationState
> {
  static jsClass = "CardNavigation";
  static template = schema;
  static slots: string[] = [];
  static defaultProps = {
    ...GoatComponent.defaultProps,
    cardClasses: "",
    iconClasses: "",
    labelClasses: "",
    childrenIn: undefined,
  };

  constructor(props: CardNavigationProps) {
    super(props);
    Object.assign(this.state, {
      menuLinksCards: this.buildCards(),
    });
  }

  get childrenIn() {
    if (this.props.childrenIn !== undefined) return this.props.childrenIn;
    return [this.props.name, "children"].join("-");
  }

  buildCards() {
    const { menu } = this.props;
    const definitions = deepMerge(
      schema.definitions || {},
      this.props.definitions
    );
    const template = definitions.card;
    return menu.map((item) =>
      resolveRefs(template, {
        props: this.props,
        data: item,
        state: this.state,
        eval: {
          classes: item.classes || this.props.cardClasses,
          iconClasses: item.iconClasses || this.props.iconClasses,
        },
      })
    );
  }

  mutations(name: string, conf: any) {
    const id = name.split("-").pop();
    switch (id) {
      case "childrenCard": {
        return {
          active: !!this.props.children && this.props.childrenIn === undefined,
        };
      }
      case "card": {
        const background =
          typeof conf.bg === "string" ? resolveSrc(conf.bg) : conf.bg;
        return {
          style: {
            ...(background ? { "--dbl-bg": `url("${background}")` } : {}),
          },
        };
      }
      default:
        break;
    }
    return super.mutations(name, conf);
  }
}