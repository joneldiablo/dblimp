import { deepMerge, resolveRefs } from "@dblimp/core";
import JsonRenderComponent, {
  JsonRenderComponentProps,
  JsonRenderComponentState,
} from "@dblimp/core/json-render-component";

import { resolveSrc } from "../../utils/assets";

import "./card-service.scss";

import schema from "./card-service.json";

export interface CardServiceProps extends JsonRenderComponentProps {
  name: string;
  imgSrc?: string;
  icon?: string;
  description?: string;
  list?: any;
  btnContent?: string;
  bodyClasses?: string;
  iconClasses?: string;
  labelClasses?: string;
  ctaTo?: string;
}

export interface CardServiceState extends JsonRenderComponentState {}

export default class CardService extends JsonRenderComponent<
  CardServiceProps,
  CardServiceState
> {
  static jsClass = "CardService";
  static template = schema;
  static slots = ["description", "list"];
  static defaultProps = {
    ...JsonRenderComponent.defaultProps,
    label: "",
    description: "",
    list: [],
    bodyClasses: "",
    iconClasses: "",
    labelClasses: "",
    btnContent: "",
    ctaTo: "/servicios",
    childrenIn: undefined,
  };

  classes = "card h-100 shadow-sm";

  constructor(props: CardServiceProps) {
    super(props);
  }

  get childrenIn() {
    if (this.props.childrenIn !== undefined) return this.props.childrenIn;
    return ["childrenHere", this.props.name].join("-");
  }

  mutations(name: string, conf: any) {
    const id = name.split("-").shift();
    switch (id) {
      case "cardTitle": {
        return { content: this.props.label };
      }
      case "cardText": {
        return { content: this.props.description };
      }
      case "cardList": {
        return { content: this.props.list };
      }
      default:
        break;
    }
    return super.mutations(name, conf);
  }
}