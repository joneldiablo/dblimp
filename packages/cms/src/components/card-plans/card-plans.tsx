import JsonRenderComponent, {
  JsonRenderComponentProps,
  JsonRenderComponentState,
} from "@dblimp/core/json-render-component";

import "./card-plans.scss";

import schema from "./card-plans.json";

export interface CardPlansProps extends JsonRenderComponentProps {
  name: string;
  price?: string;
  description?: string;
  list?: any;
  ctaContent?: string;
  ctaTo?: string;
  ctaClasses?: string;
  bodyClasses?: string;
  labelClasses?: string;
  priceClasses?: string;
  descriptionClasses?: string;
  listClasses?: string;
}

export interface CardPlansState extends JsonRenderComponentState {}

export default class CardPlans extends JsonRenderComponent<
  CardPlansProps,
  CardPlansState
> {
  static jsClass = "CardPlans";
  static template = schema;
  static slots = ["description", "list"];
  static defaultProps = {
    ...JsonRenderComponent.defaultProps,
    classes: "card h-100 text-dark shadow-sm",
    label: "",
    price: "",
    description: "",
    list: [],
    ctaContent: "",
    ctaTo: "/planes",
    ctaClasses: "btn-primary w-100",
    bodyClasses: "",
    labelClasses: "",
    priceClasses: "",
    descriptionClasses: "",
    listClasses: "",
    childrenIn: undefined,
  };

  get childrenIn() {
    if (this.props.childrenIn !== undefined) return this.props.childrenIn;
    return ["childrenHere", this.props.name].join("-");
  }

  mutations(name: string, _conf: any) {
    const id = name.split("-").shift();
    switch (id) {
      case "label": {
        return { content: this.props.label };
      }
      case "price": {
        return { content: this.props.price };
      }
      case "description": {
        return { content: this.props.description };
      }
      case "list": {
        return { content: this.props.list };
      }
      case "cta": {
        return {
          content: this.props.ctaContent,
          to: this.props.ctaTo,
          classes: this.props.ctaClasses,
        };
      }
      default:
        break;
    }
    return super.mutations(name, _conf);
  }
}