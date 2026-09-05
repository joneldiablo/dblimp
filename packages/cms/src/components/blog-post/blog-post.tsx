import JsonRenderComponent, {
  JsonRenderComponentProps,
} from "@dblimp/core/json-render-component";
import { resolveRefs } from "@dblimp/core";

import schema from "./blog-post.json";
import "./style.scss";

export interface BlogPostProps extends JsonRenderComponentProps {
  title: any;
  resume: any;
  imageSrc: string | string[];
  backgroundImageSrc: string;
  color: string;
  gallery?: string[];
  icon?: string;
  image: string;
}

export default class BlogPost extends JsonRenderComponent<BlogPostProps> {
  static jsClass = "BlogPost";
  static template = schema;
  static slots = ["title", "resume", "description"];
  static defaultProps = {
    ...JsonRenderComponent.defaultProps,
    childrenIn: undefined,
    title: "",
    resume: "",
  };

  style = {};

  constructor(props: BlogPostProps) {
    super(props);
    this.events.push([
      "resize." + props.name + "-resumeGrid",
      this.handleResize.bind(this),
    ]);
  }

  get childrenIn() {
    return null;
  }

  componentDidMount() {
    super.componentDidMount();
    if (this.props.gallery) {
      this.setState({
        slides: this.renderSlide(this.props.gallery),
      });
    }
  }

  componentDidUpdate(
    prevProps: Readonly<JsonRenderComponentProps>,
    prevState: Readonly<{}>,
    snapshot?: any
  ): void {
    if (prevProps.children !== this.props.children) {
      this.forceUpdate();
    }
  }

  handleResize(data: any) {
    this.setState({
      breakpoint: data.breakpoint,
    });
  }

  renderSlide(images: string[]) {
    const constructor = this.constructor as any;
    return images.map((src, i) =>
      resolveRefs(
        {
          name: "slide" + i,
          ...constructor.template.definitions.slide,
        },
        { data: { image: src } }
      )
    );
  }

  mutations(name: string, conf: any) {
    const id = name.split("-").pop();
    switch (id) {
      case "image": {
        return {
          active: !!this.props.image,
        };
      }
      case "titleBP": {
        return {
          classes: [
            conf.classes[0],
            this.props.color
              ? `text-${this.props.color} border-${this.props.color}`
              : conf.classes[1],
          ],
          content: [conf.content[0], this.props.title],
        };
      }
      case "icon": {
        return { active: !!this.props.icon };
      }
      case "intro": {
        return { content: [conf.content[0], this.props.resume] };
      }
      case "gallery": {
        const responsive: any = {
          xs: {},
          sm: {
            perPage: 3,
            perMove: 1,
            gap: "0rem",
            rewind: true,
          },
          md: {
            perPage: 4,
            perMove: 1,
            gap: "0rem",
            rewind: true,
          },
          lg: {
            perPage: 4,
            perMove: 1,
            gap: "0rem",
            rewind: true,
          },
          xl: {
            perPage: 6,
            perMove: 1,
            gap: "0rem",
            rewind: true,
          },
        };
        responsive.xxl = responsive.xl;
        return {
          active: !!this.state.slides?.length,
          slider: {
            options: responsive[this.state.breakpoint] || responsive.xs,
          },
          content: this.state.slides || [],
        };
      }
      case "children": {
        return { content: this.props.children };
      }
      default:
        break;
    }
    return super.mutations(name, conf);
  }
}