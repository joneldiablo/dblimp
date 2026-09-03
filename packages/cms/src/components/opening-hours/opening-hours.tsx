import hash from "object-hash";

import JsonRenderComponent, {
  JsonRenderComponentProps,
  JsonRenderComponentState,
} from "@dblimp/core/json-render-component";
import { deepMerge, resolveRefs } from "@dblimp/core";

import schema from "./opening-hours.json";
import "./opening-hours.scss";

type TClasses = string | string[];

export interface OpeningHoursProps extends JsonRenderComponentProps {
  icon?: string;
  iconClasses?: TClasses | TClasses[];
  hours?: any[];
  interval: boolean;
}

export interface OpeningHoursState extends JsonRenderComponentState {
  hours: { days: (string | number)[]; hours: (string | number)[] }[];
}

export default class OpeningHours<
  TProps extends OpeningHoursProps = OpeningHoursProps,
  TState extends OpeningHoursState = OpeningHoursState
> extends JsonRenderComponent<OpeningHoursProps, OpeningHoursState> {
  static jsClass = "OpeningHours";
  static template = schema;
  static slots: string[] = [];
  static defaultProps = {
    ...JsonRenderComponent.defaultProps,
    childrenIn: undefined,
    interval: true,
    hours: [],
  };

  hashHours?: string;
  classes = "d-flex flex-wrap align-items-center";
  style = {};

  constructor(props: TProps) {
    super(props);
    this.state = this.state as TState;
    Object.assign(this.state, {
      hours: [],
    });
  }

  get childrenIn() {
    return [this.props.name, "children"].join("-");
  }

  componentDidUpdate(preProps: Partial<OpeningHoursProps>, preState: any) {
    if (this.props.hours) {
      const hashArray = hash(this.props.hours, {
        algorithm: "sha1",
        encoding: "hex",
        unorderedArrays: true,
        respectType: true,
        excludeKeys: (key: string) =>
          !["$$typeof", "__proto__", "ref", "prototype"].includes(key),
      });
      if (hashArray !== this.hashHours) {
        this.hashHours = hashArray;
        this.buildHours();
      }
    }
  }

  buildHours() {
    const definitions = deepMerge(
      (this.constructor as typeof OpeningHours).template?.definitions || {},
      this.props.definitions
    );
    this.setState(
      {
        hours: this.props.hours!.map((a, i) =>
          resolveRefs(definitions.hours, {
            props: this.props,
            state: this.state,
            definitions,
            key: i,
            data: {
              name: i,
              id: i,
              ...a,
              buildHour: this.buildHour(a, definitions, a.id ?? i),
            },
          })
        ),
        hoursHasChange: true,
      } as any,
      () => {
        this.state.hoursHasChange = false;
      }
    );
  }

  spliceBetween(input: any[], separator: any) {
    return input.flatMap((val, i, arr) =>
      i < arr.length - 1 ? [val, separator] : [val]
    );
  }

  buildHour(
    {
      days,
      hours,
      message,
    }: {
      days: (string | number)[];
      hours: [string | number, string | number];
      message: any;
    },
    definitions: any,
    id: number | string
  ) {
    const acc: any[] = [];

    if (this.props.interval && days.length <= 2) {
      acc.push(
        ...this.spliceBetween(
          days.map((d, i) =>
            resolveRefs(definitions.element, {
              state: this.state,
              props: this.props,
              definitions,
              data: {
                id: `${i}-${id}`,
                value: d,
                type: "day",
                format: "dictionary",
                formatConf: null,
                context: "days",
              },
            })
          ),
          " to "
        )
      );
    } else if (days.length >= 2) {
      const bDays = days.map((d, i) =>
        resolveRefs(definitions.element, {
          state: this.state,
          props: this.props,
          definitions,
          data: {
            id: `${i}-${id}`,
            value: d,
            type: "day",
            format: "dictionary",
            formatConf: null,
            context: "days",
          },
        })
      );
      const lastday = bDays.pop();
      acc.push(...this.spliceBetween(bDays, ", "), " and ", lastday);
    }

    acc.push(
      " from ",
      ...this.spliceBetween(
        hours.map((d, i) =>
          resolveRefs(definitions.element, {
            state: this.state,
            props: this.props,
            definitions,
            data: {
              id: `${i}-${id}`,
              value: d,
              type: "hour",
              format: "dictionary",
            },
          })
        ),
        " to "
      ),
      message
        ? resolveRefs(definitions.message, {
            state: this.state,
            props: this.props,
            definitions,
            data: {
              id,
              message,
            },
          })
        : null,
      "."
    );
    return acc;
  }

  mutations(name: string, conf: any) {
    const id = name.split("-").pop() as string;
    if ((this.state as any)[id] && (this.state as any)[id + "HasChange"]) {
      const tr = resolveRefs(conf, {
        state: this.state,
        props: this.props,
      });
      return tr;
    }
    switch (id) {
      case "label": {
        return {
          active: !!this.props.label,
          content: this.props.label,
        };
      }
      case "list": {
        return {
          active: !!this.state.hours?.length,
          content: this.state.hours,
        };
      }
      case "children": {
        return {
          active: !!this.props.children,
        };
      }
      default:
        break;
    }
    return super.mutations(name, conf);
  }
}