import React, { ReactNode } from "react";

import eventHandler from "dbl-utils/event-handler";
import { deepMerge } from "dbl-utils/object-mutation";
import resolveRefs from "dbl-utils/resolve-refs";

import JsonRender from "./json-render";
import Component, { ComponentProps, ComponentState } from "./component";
import { addComponents } from "./component-registry";

export interface JsonRenderComponentProps extends ComponentProps {
  view?: any;
  childrenIn?: boolean | string;
  definitions?: Record<string, any>;
  content?: string | any[] | object;
  children?: ReactNode;
}

export interface JsonRenderComponentState extends ComponentState {
  [key: string]: any;
}

export interface ComponentTemplateSchema {
  view: Record<string, any>;
  definitions?: Record<string, any>;
  rules?: Record<string, any>;
}

export default class JsonRenderComponent<
  TProps extends JsonRenderComponentProps = JsonRenderComponentProps,
  TState extends JsonRenderComponentState = JsonRenderComponentState
> extends Component<TProps, TState> {
  static jsClass = "JsonRenderComponent";
  static template?: ComponentTemplateSchema | null = {
    view: {},
    definitions: {}
  };

  static defaultProps: Partial<JsonRenderComponentProps> = {
    ...Component.defaultProps,
    view: null,
    childrenIn: false,
    definitions: {}
  };

  protected events: [string, (...args: any[]) => void][] = [];
  protected jsonRender: JsonRender;
  protected templateSolved: any;

  constructor(props: TProps) {
    super(props);
    this.tag = "div";
    Object.assign(this.state, {});
    this.jsonRender = new JsonRender(this.fixedProps, this.mutations.bind(this));
    this.jsonRender.childrenIn = this.childrenIn;
    this.evalTemplate();
  }

  get fixedProps(): TProps {
    return this.props;
  }

  get childrenIn(): string | boolean | null {
    return this.props.childrenIn ?? false;
  }

  get theView(): any {
    return (this.constructor as typeof JsonRenderComponent).template?.view;
  }

  get theTemplate(): any {
    return (this.constructor as typeof JsonRenderComponent).template || {};
  }

  componentDidMount(): void {
    this.events.forEach(([evtName, callback]) =>
      eventHandler.subscribe(evtName, callback, this.name)
    );
    this.evalTemplate();
  }

  evalTemplate() {
    const definitions = deepMerge(
      this.theTemplate?.definitions || {},
      this.props.definitions || {}
    );

    this.templateSolved = this.props.view
      ? resolveRefs(this.props.view, {
          template: this.theView,
          definitions,
          props: this.props,
          state: this.state
        })
      : resolveRefs(this.theView, {
          definitions,
          props: this.props,
          state: this.state
        });
  }

  componentWillUnmount(): void {
    this.events.forEach(([eName]) => eventHandler.unsubscribe(eName, this.name));
  }

  mutations(sectionName: string, section: any): any {
    return (this.state as any)[sectionName];
  }

  content(children = this.props.children): any {
    if (!this.templateSolved) return null;

    const builded = this.jsonRender.buildContent(this.templateSolved);
    return !this.childrenIn ? (
      <>
        {builded}
        {children}
      </>
    ) : (
      builded
    );
  }
}

addComponents({ JsonRenderComponent });