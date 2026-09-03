import hash from "object-hash";
import { Location } from "react-router";

import GoatComponent, {
  GoatComponentProps,
} from "@dblimp/core/goat-component";
import { deepMerge, resolveRefs, eventHandler } from "@dblimp/core";

import schema from "./articles-list.json";
import "./style.scss";

export interface ArticlesListProps extends GoatComponentProps {
  articles: any[];
  filterFields: any[];
  basePath: string;
  location: any;
  submitColor: string;
  linkColor: string;
  activeColor: string;
  filterFieldsMutation?: (
    name: string,
    conf: Record<string, any>
  ) => undefined | Record<string, any>;
  status?: string;
  disabled?: boolean;
}

export default class ArticlesList extends GoatComponent<ArticlesListProps> {
  static jsClass = "ArticlesList";
  static template = schema;
  static slots: string[] = [];
  static defaultProps = {
    ...GoatComponent.defaultProps,
    childrenIn: undefined,
    filters: [],
    activeColor: "primary",
    submitColor: "secondary",
    linkColor: "primary",
  };

  hashArticles?: string;
  classes = ["container-fluid"];
  style = {};
  ready?: ReturnType<typeof setTimeout>;
  timeoutForm?: ReturnType<typeof setTimeout>;

  constructor(props: ArticlesListProps) {
    super(props);
    this.events.push(
      ["location", this.onChangeLocation.bind(this)],
      [`valid.${this.props.name}-panel`, this.onValidFilter.bind(this)],
      [`invalid.${this.props.name}-panel`, this.onInvalidFilter.bind(this)],
      [`change.${this.props.name}-panel`, this.onChangeFilter.bind(this)],
      [`${this.props.name}-panel`, this.onSubmitFilter.bind(this)],
      [`ready.${this.props.name}-panel`, this.onReadyFormFilter.bind(this)],
      [`${this.props.name}-*-link`, this.onNavigate.bind(this)],
      [`resize.${this.props.name}-gridArticles`, this.onResize.bind(this)],
      [`update.${this.props.name}`, this.onUpdate.bind(this)],
      [this.props.name + "-reloadBtn", this.onRefresh.bind(this)]
    );

    Object.assign(this.state, {
      size: {},
      filterFieldNames: [],
      location: this.props.location,
    });
  }

  get childrenIn() {
    return [this.props.name, "children"].join("-");
  }

  componentDidUpdate(prevProps: Partial<ArticlesListProps>, prevState: any) {
    const hashArray = hash(this.props.articles);
    if (hashArray !== this.hashArticles) {
      this.hashArticles = hashArray;
      this.buildArticlesList();
    }
  }

  componentWillUnmount(): void {
    clearTimeout(this.ready);
    clearTimeout(this.timeoutForm);
    super.componentWillUnmount();
  }

  onRefresh() {
    console.log("dentro!!!!! refresh");
    console.log((this as any).name);
    eventHandler.dispatch(`refresh.${this.props.name}`);
  }

  onChangeLocation(location: Location) {
    this.setState({ location });
  }

  onValidFilter(data: any) {
    eventHandler.dispatch(`valid.${this.props.name}`, data);
  }

  onInvalidFilter(data: any) {
    eventHandler.dispatch(`invalid.${this.props.name}`, data);
  }

  onChangeFilter(data: any) {
    eventHandler.dispatch(`change.${this.props.name}`, data);
  }

  onSubmitFilter(data: any) {
    eventHandler.dispatch(`submit.${this.props.name}`, data);
  }

  onNavigate({ id, ...raw }: any) {
    const info = raw[id];
    const regex = /^list-(.*)-link$/;
    const match = info.name.match(regex);
    eventHandler.dispatch(`${this.props.name}`, {
      [this.props.name]: match?.[1],
    });
  }

  onUpdate({ data }: any) {
    if (data !== undefined)
      eventHandler.dispatch(`update.${this.props.name}-panel`, { data });
  }

  onReadyFormFilter() {
    clearTimeout(this.timeoutForm);
    this.timeoutForm = setTimeout(
      () => eventHandler.dispatch(`ready.${this.props.name}`),
      50
    );
  }

  onResize(data: any) {
    this.setState({ size: data });
  }

  buildArticlesList() {
    if (!Array.isArray(this.props.articles)) return;
    const definitions = deepMerge(
      (this.constructor as typeof ArticlesList).template?.definitions || {},
      this.props.definitions
    );
    const filterFieldNames = Object.entries(this.props.filterFields).map(
      ([key, field]: [string, any]) => field.name || key
    );
    this.setState({
      filterFieldNames,
      articles: this.props.articles.map((a, i) =>
        resolveRefs(definitions.line, {
          props: this.props,
          state: this.state,
          data: { name: i, ...a },
        })
      ),
    });
  }

  mutations(name: string, conf: any) {
    if (
      typeof this.props.filterFieldsMutation === "function" &&
      this.state.filterFieldNames?.includes(name)
    )
      return this.props.filterFieldsMutation(name, conf);
    const id = name.split("-").pop();
    switch (id) {
      case "gridArticles": {
        return {
          colClasses:
            this.state.location.pathname === this.props.basePath
              ? conf.listColClasses
              : conf.articleColClasses,
        };
      }
      case "submitBtn": {
        return {
          status: this.props.status,
          disabled: this.props.disabled,
          classes: [conf.classes, `btn-${this.props.submitColor}`],
        };
      }
      case "panel": {
        return {
          active:
            this.state.location.pathname === this.props.basePath ||
            !["xs", "sm"].includes(this.state.size?.breakpoint),
        };
      }
      case "list": {
        return {
          active:
            this.state.location.pathname === this.props.basePath ||
            !["xs", "sm"].includes(this.state.size?.breakpoint),
          content: this.state.articles,
        };
      }
      case "articleView": {
        return {
          active: this.state.location.pathname !== this.props.basePath,
        };
      }
      case "line": {
        const isActive =
          this.state.location.pathname.split("/").pop() === conf.dataName;

        return {
          classes: [
            conf.classes,
            isActive ? `border-${this.props.activeColor}` : null,
          ],
        };
      }
      case "link": {
        return {
          active:
            this.state.location.pathname.split("/").pop() !== conf.dataName,
          classes: [conf.classes, `btn-${this.props.linkColor}`],
        };
      }
      default:
        break;
    }
    return super.mutations(name, conf);
  }

  render() {
    const r = super.render();
    clearTimeout(this.ready);
    return r;
  }
}