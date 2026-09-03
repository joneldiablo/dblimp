import React from "react";

import { resolveRefs } from "@dblimp/core";
import GoatComponent, {
  GoatComponentProps,
} from "@dblimp/core/goat-component";

import { resolveSrc } from "../../utils/assets";

import schema from "./header-blog.json";
import "./style.scss";

export interface HeaderBlogProps extends GoatComponentProps {
  title?: any;
  description?: any;
  imageSrc: string | string[];
  backgroundImageSrc: string;
  left?: { title: any; description: any }[];
}

export default class HeaderBlog extends GoatComponent<HeaderBlogProps> {
  static jsClass = "HeaderBlog";
  static template = schema;
  static slots = ["title", "description"];
  static defaultProps = {
    ...GoatComponent.defaultProps,
    childrenIn: undefined,
    titleTag: "h1",
    titleClasses: "text-primary",
    descriptionTag: "p",
    descriptionClasses: "",
    imageSrc: "https://dummyimage.com/600x200/000/fff",
    imageClasses: "m-0",
    backgroundImageSrc: "https://dummyimage.com/1428x214/0ff/f00",
  };

  style: React.CSSProperties & { "--background-image": string } = {
    "--background-image": `url("${resolveSrc(this.props.backgroundImageSrc)}")`,
  };

  constructor(props: HeaderBlogProps) {
    super(props);

    Object.assign(this.state, {
      leftContent: [],
    });
  }

  get childrenIn() {
    return [this.props.name, "children"].join("-");
  }

  componentDidMount(): void {
    const leftContent: any[] = [];
    if (this.props.title || this.props.description) {
      leftContent.push(
        this.buildLeftContent({
          title: this.props.title,
          description: this.props.description,
        }, true)
      );
    }
    if (this.props.left) {
      leftContent.push(
        ...this.props.left.map(this.buildLeftContent.bind(this))
      );
    }
    this.setState({
      leftContent,
    });
    super.componentDidMount();
  }

  buildLeftContent(
    data: { title: any; description: any },
    principal: number | boolean = false
  ) {
    const leftContentTemplate = (
      this.constructor as typeof HeaderBlog
    ).template?.definitions.leftContent;
    const template = resolveRefs(leftContentTemplate, {
      props: this.props,
      data,
      principal: typeof principal === "number" ? false : principal,
    });
    return template;
  }

  mutations(name: string, conf: any) {
    const id = name.split("-").pop();
    switch (id) {
      case "title": {
        return {
          active: conf.principal
            ? !!this.props.title
            : !["$data/title", undefined, null, false].includes(conf.content),
          content: conf.principal ? this.props.title : conf.content,
        };
      }
      case "description": {
        return {
          active: conf.principal
            ? !!this.props.description
            : !["$data/description", undefined, null, false].includes(
                conf.content
              ),
          content: conf.principal ? this.props.description : conf.content,
        };
      }
      case "images": {
        return {
          active: !!this.props.imageSrc,
          src: this.props.imageSrc,
        };
      }
      case "left": {
        const active = this.state.leftContent.length > 0;
        const up = this.state.leftContent.length > 1;
        return {
          active,
          slider: {
            options: {
              perPage: 1,
              rewind: true,
              arrows: up,
              pagination: up,
              drag: up,
            },
          },
          content: this.state.leftContent,
        };
      }
      default:
        break;
    }
    return super.mutations(name, conf);
  }
}