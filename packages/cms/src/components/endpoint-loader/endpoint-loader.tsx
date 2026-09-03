import { deepMerge, resolveRefs, eventHandler, appCtrl } from "@dblimp/core";
import JsonRenderComponent, {
  JsonRenderComponentProps,
  JsonRenderComponentState,
} from "@dblimp/core/json-render-component";

import schema from "./endpoint-loader.json";
import "./endpoint-loader.scss";

/**
 * EVENTS:
 *        "loading." + this.props.name
 *        "error." + this.props.name
 *        "done."  + this.props.name
 **/

export type placeholderData = Record<string, any> & {
  id: number | string;
  length?: number;
};

export type hasImgPlaceholder = boolean | undefined;
export type isMedia = boolean | undefined;

export interface EndpointLoaderProps extends JsonRenderComponentProps {
  method: string;
  endpoint: string;
  fetchOptions?: Record<string, any>;
  placeholderData: placeholderData | placeholderData[];
  errorTemplate?: JsonRenderComponentProps;
  template: JsonRenderComponentProps;
  emptyTemplate?: JsonRenderComponentProps;
  rules?: Record<string, [string, ...any]>;
  gridClasses?: string | string[];
  colClasses?: string | string[];
  loading?: boolean;
  childrenPos?: "top" | "bottom";
  dataPath: string;
}

export interface EndpointLoaderState extends JsonRenderComponentState {
  data?: any;
  error?: boolean;
  placeholderData: placeholderData[];
  isLoading?: boolean;
}

export default class EndpointLoader extends JsonRenderComponent<
  EndpointLoaderProps,
  EndpointLoaderState
> {
  static jsClass = "EndpointLoader";
  static template = schema;
  static defaultProps = {
    ...JsonRenderComponent.defaultProps,
    endpoint: "",
    fetchOptions: {},
    placeholderData: [{ id: 1 }, { id: 2 }, { id: 3 }],
    errorTemplate: schema.definitions?.defaultErrorEL,
    template: false,
    emptyTemplate: false,
    childrenPos: "top",
    gridClasses: "gy-3",
    colClasses:
      "auto-xs-12 auto-sm-12 auto-md-6 auto-lg-4 auto-xl-4 auto-xxl-3",
    content: "",
    childrenIn: undefined,
    method: "GET",
    dataPath: "$data",
  };

  wsConnection?: WebSocket;

  constructor(props: EndpointLoaderProps) {
    super(props);
    this.events.push(
      ["reload-" + props.name, this.onReload.bind(this)],
      ["reload." + props.name, () => this.fetchData()]
    );
    let data: placeholderData[];
    if (Array.isArray(props.placeholderData)) {
      data = [...props.placeholderData];
    } else {
      const base = { ...props.placeholderData };
      const length = base.length || 3;
      delete base.length;
      data = Array(length)
        .fill(base)
        .map((item, index) => ({ ...(item as placeholderData), id: index + 1 }));
    }
    Object.assign(this.state, {
      placeholderData: data,
      isLoading: true,
    });
  }

  componentDidMount() {
    super.componentDidMount();
    this.fetchData();
  }

  get childrenIn() {
    return [this.props.childrenPos + "EL", this.props.name].join("-");
  }

  onReload() {
    this.fetchData();
  }

  async fetchData() {
    const { endpoint, fetchOptions } = this.props;

    if (!endpoint) {
      this.setState({ isLoading: !!this.props.loading });
      return;
    }

    this.setState({ isLoading: true, error: false });
    eventHandler.dispatch("loading." + this.props.name, {});

    try {
      if (/^wss?:\/\//.test(endpoint)) {
        this.connectWebSocket(endpoint);
        return;
      }

      if (/^https?:\/\//.test(endpoint)) {
        const response = await fetch(endpoint, {
          method: this.props.method || "GET",
          ...fetchOptions,
        });
        const result = await response.json();
        this.handleFetchResponse(result);
        return;
      }

      if (/^[\w/]/.test(endpoint)) {
        const result = await appCtrl.fetch(endpoint, {
          method: this.props.method || "GET",
          ...fetchOptions,
        });
        this.handleFetchResponse(result);
        return;
      }
    } catch (err: Error | any) {
      console.error("EndpointLoader fetch error:", err);
      Object.assign(this.state, {
        error: JSON.stringify(err, null, 2),
        errorMessage: err.message || err.status + "." + err.code,
      });
      this.evalTemplate();
      this.setState(
        {
          isLoading: false,
        },
        () =>
          eventHandler.dispatch("error." + this.props.name, {
            error: err,
          })
      );
    }
  }

  handleFetchResponse(result: any) {
    if (result && result.success && result.data) {
      const rawData = resolveRefs(this.props.dataPath, result);
      const data = [rawData].flat();
      Object.assign(this.state, {
        placeholderData: data,
        error: false,
      });
      this.evalTemplate();
      this.setState(
        {
          data,
          error: false,
          isLoading: false,
        },
        () =>
          eventHandler.dispatch("done." + this.props.name, {
            data,
          })
      );
    } else {
      Object.assign(this.state, {
        error: JSON.stringify(result, null, 2),
        errorMessage:
          result.message ||
          [result.status, result.code].filter(Boolean).join(".") ||
          "Unknown error",
      });
      this.evalTemplate();
      this.setState(
        {
          isLoading: false,
        },
        () =>
          eventHandler.dispatch("error." + this.props.name, {
            error: result,
          })
      );
    }
  }

  connectWebSocket(wsEndpoint: string) {
    try {
      this.wsConnection = new WebSocket(wsEndpoint);

      this.wsConnection.onopen = () => {
        console.log("WebSocket connected:", wsEndpoint);
      };

      this.wsConnection.onmessage = (event) => {
        try {
          const result = JSON.parse(event.data);
          this.handleFetchResponse(result);
        } catch (err: Error | any) {
          console.error("Error parsing WebSocket message:", err);
          Object.assign(this.state, {
            error: JSON.stringify(err, null, 2),
            errorMessage: err.message || err.status + "." + err.code,
          });
          this.evalTemplate();
          this.setState(
            {
              isLoading: false,
            },
            () =>
              eventHandler.dispatch("error." + this.props.name, {
                error: err,
              })
          );
        }
      };

      this.wsConnection.onerror = (error: Error | any) => {
        console.error("WebSocket error:", error);
        Object.assign(this.state, {
          error: JSON.stringify(error, null, 2),
          errorMessage: error.message || error.status + "." + error.code,
        });
        this.evalTemplate();
        this.setState({
          isLoading: false,
        });
      };

      this.wsConnection.onclose = () => {
        console.log("WebSocket disconnected");
      };
    } catch (err: Error | any) {
      console.error("WebSocket connection error:", err);
      Object.assign(this.state, {
        error: JSON.stringify(err, null, 2),
        errorMessage: err.message || err.status + "." + err.code,
      });
      this.evalTemplate();
      this.setState({
        isLoading: false,
      });
    }
  }

  componentWillUnmount() {
    if (this.wsConnection) {
      this.wsConnection.close();
    }
    super.componentWillUnmount();
  }

  evalTemplate() {
    const Constructor = this.constructor as typeof JsonRenderComponent;
    const definitions = deepMerge(
      Constructor.template?.definitions || {},
      this.props.definitions
    );
    const rules = {
      ...(Constructor.template?.rules || {}),
      ...(this.props.rules || {}),
    };

    this.templateSolved = this.props.view
      ? resolveRefs(
          this.props.view,
          {
            template: this.theView,
            definitions,
            props: this.props,
            state: this.state,
          },
          rules
        )
      : resolveRefs(
          this.theView,
          {
            definitions,
            props: this.props,
            state: this.state,
          },
          rules
        );
  }

  mutations(name: string, conf: any) {
    if (
      conf.component &&
      (conf.component.endsWith("Field") ||
        ["Action", "Link", "NavLink"].includes(conf.component))
    ) {
      return {
        disabled: !!this.state.isLoading,
      };
    }

    if (["a", "button", "input"].includes(conf.tag)) {
      return {
        _props: { disabled: !!this.state.isLoading },
      };
    }

    if (name.includes("errorEL")) {
      return {
        active: !!this.state.error,
      };
    }

    if (name.includes("emptyStateEL")) {
      const isEmpty =
        !this.state.placeholderData || this.state.placeholderData.length === 0;
      return {
        active: isEmpty && !this.state.isLoading && !this.state.error,
      };
    }

    if (name.includes("containerEL")) {
      const isEmpty =
        !this.state.placeholderData || this.state.placeholderData.length === 0;
      return {
        active: (!isEmpty || this.state.isLoading) && !this.state.error,
      };
    }

    if (conf.hasImgPlaceholder) {
      const content = conf.content;
      let placeholderNode: any;
      let mediaNode: any;
      Object.values(content).forEach((node: any) => {
        if (node.classes && node.classes.includes("placeholder"))
          placeholderNode = node;

        if (
          node.tag === "img" ||
          (node.component && ["Image", "Icons"].includes(node.component)) ||
          node.isMedia
        )
          mediaNode = node;
      });
      const loaded = !!(
        mediaNode &&
        (mediaNode.src ||
          mediaNode.icon ||
          mediaNode._props?.src ||
          mediaNode.content)
      );

      if (placeholderNode) placeholderNode.active = !loaded;
      if (mediaNode) mediaNode.active = loaded;
      return;
    }

    return super.mutations(name, conf);
  }
}