import JsonRenderContainer, {
  JsonRenderContainerProps,
  JsonRenderContainerState,
} from "../containers/json-render-container";

// Definimos la interfaz para las propiedades del componente
export interface ControllerProps extends JsonRenderContainerProps {
  test?: boolean;
  routesIn?: string;
  [key: string]: any; // Permite heredar props dinámicamente de JsonRenderContainer
}

// Definimos la interfaz para el estado del componente
export interface ControllerState extends JsonRenderContainerState {
  localClasses: string;
}

/**
 * View component that extends JsonRenderContainer
 */
export default class Controller<
  TProps extends ControllerProps = ControllerProps,
  TState extends ControllerState = ControllerState
> extends JsonRenderContainer<TProps, TState> {
  static jsClass = "Controller";

  static defaultProps: Partial<ControllerProps> = {
    ...JsonRenderContainer.defaultProps,
    test: false,
  };
  static template = null;

  constructor(props: TProps) {
    super(props);
    this.tag = "article";
    this.state = this.state as TState;
    Object.assign(this.state, {
      localClasses: this.props.test ? "test-view-wrapper" : "",
    });
  }

  get fixedProps(): TProps {
    return {
      ...this.props,
      childrenIn: this.props.routesIn,
    };
  }

  get childrenIn(): string | boolean {
    return this.props.routesIn || super.childrenIn;
  }

  get theView(): any {
    return this.props.content || super.theView;
  }

  componentDidUpdate(prevProps: TProps) {
    if (prevProps.test !== this.props.test) {
      const { localClasses } = this.state;
      const setClasses = new Set(localClasses.split(" "));

      if (this.props.test) {
        setClasses.add("test-view-wrapper");
      } else {
        setClasses.delete("test-view-wrapper");
      }

      this.setState({
        localClasses: [...setClasses].join(" "),
      });
    }
  }
}
