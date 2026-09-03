import hash from "object-hash";

import GoatComponent, {
  GoatComponentProps,
  GoatComponentState,
} from "@dblimp/core/goat-component";
import { deepMerge, resolveRefs } from "@dblimp/core";

import schema from "./_template.json";
import "./_template.scss";

export interface CmsTemplateProps extends GoatComponentProps {
  _templateArrayProp?: any[];
}

export interface CmsTemplateState extends GoatComponentState {}

export default class CmsTemplate<
  TProps extends GoatComponentProps = CmsTemplateProps,
  TState extends GoatComponentState = CmsTemplateState
> extends GoatComponent<CmsTemplateProps, CmsTemplateState> {
  static jsClass = "CmsTemplate";
  static template = schema;
  static slots: string[] = [];
  static defaultProps = {
    ...GoatComponent.defaultProps,
    childrenIn: undefined,
  };

  classes = [];
  style = {};

  constructor(props: TProps) {
    super(props);
    this.state = this.state as TState;
  }

  get childrenIn() {
    return [this.props.name, "children"].join("-");
  }

  hashTemplateArr?: string;

  componentDidUpdate(preProps: Partial<CmsTemplateProps>, preState: any) {
    if (this.props._templateArrayProp) {
      const hashArray = hash(this.props._templateArrayProp, {
        algorithm: "sha1",
        encoding: "hex",
        unorderedArrays: true,
        respectType: true,
        excludeKeys: (key: string) =>
          !["$$typeof", "__proto__", "ref", "prototype"].includes(key),
      });
      if (hashArray !== this.hashTemplateArr) {
        this.hashTemplateArr = hashArray;
        this.buildTemplate();
      }
    }
  }

  buildTemplate() {
    const definitions = deepMerge(
      (this.constructor as typeof CmsTemplate).template?.definitions || {},
      this.props.definitions
    );
    this.setState(
      {
        _templateArr: this.props._templateArrayProp!.map((a, i) =>
          resolveRefs(definitions._templateArr, {
            props: this.props,
            state: this.state,
            definitions,
            data: { name: i, ...a },
          })
        ),
        _templateArrHasChange: true,
      },
      () => {
        this.state._templateArrHasChange = false;
      }
    );
  }

  mutations(name: string, conf: any) {
    const id = name.split("-").pop() as string;
    if ((this.state as any)[id] && (this.state as any)[id + "HasChange"]) {
      return resolveRefs(conf, {
        state: this.state,
      });
    }
    switch (id) {
      default:
        break;
    }
    return super.mutations(name, conf);
  }
}