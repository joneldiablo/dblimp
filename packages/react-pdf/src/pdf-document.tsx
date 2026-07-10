import React from "react";
import { Document, Page, View, Text, Image, Link, StyleSheet } from "@react-pdf/renderer";

import { resolveRefs } from "@dblimp/core";
import Component, { ComponentProps, ComponentState } from "@dblimp/core/component";

const PDF_COMPONENTS: Record<string, React.ElementType> = {
  PdfView: View,
  PdfText: Text,
  PdfImage: Image,
  PdfLink: Link,
  view: View,
  text: Text,
  image: Image,
  link: Link,
};

export interface PdfDocumentProps extends ComponentProps {
  size?: any;
  orientation?: "portrait" | "landscape";
  pdfContent?: any;
  definitions?: Record<string, any>;
  pageStyle?: Record<string, any>;
  wrapInPage?: boolean;
  creator?: string;
  title?: string;
  author?: string;
  subject?: string;
  keywords?: string;
  stylesheet?: Record<string, any>;
  mutations?: (name: string, section: any) => any;
}

export interface PdfDocumentState extends ComponentState {}

export default class PdfDocument extends Component<PdfDocumentProps, PdfDocumentState> {
  static jsClass = "PdfDocument";
  static dontBuildContent = true;
  static wrapper = false;

  static defaultProps: Partial<PdfDocumentProps> = {
    ...Component.defaultProps,
    size: "A4",
    orientation: "portrait",
    wrapInPage: true,
    pageStyle: {},
    pdfContent: [],
    definitions: {},
  };

  protected styles: Record<string, any> = {};

  protected buildPdfContent(node: any, index?: number): React.ReactNode {
    if (node === null || node === undefined) return null;
    if (typeof node === "string" || typeof node === "number") return node;
    if (Array.isArray(node)) return node.map((item, i) => this.buildPdfContent(item, i));

    if (React.isValidElement(node)) return node;

    const mutations =
      typeof this.props.mutations === "function"
        ? this.props.mutations(node.name || node.component, node) || {}
        : {};

    if (mutations.active === false) return null;

    const resolved = { ...node, ...mutations };
    const { component, content, children, style, ...rest } = resolved;

    if (!component && typeof resolved === "object") {
      return Object.keys(resolved).map((key, i) =>
        this.buildPdfContent(
          typeof resolved[key] === "object"
            ? { name: key, ...resolved[key] }
            : resolved[key],
          i
        )
      );
    }

    const Component_ = PDF_COMPONENTS[component] || View;
    const childContent =
      content !== undefined
        ? this.buildPdfContent(content)
        : children !== undefined
          ? this.buildPdfContent(children)
          : null;

    const resolvedStyle = style ? this.resolveStyles(style) : undefined;

    return React.createElement(Component_, {
      key: rest.name || index,
      ...rest,
      style: resolvedStyle,
    }, childContent);
  }

  protected resolveStyles(style: any): any {
    if (!style) return undefined;
    const hash = JSON.stringify(style);
    if (!this.styles[hash]) {
      this.styles[hash] = StyleSheet.create({ s: style }).s;
    }
    return this.styles[hash];
  }

  render() {
    const { pdfContent, definitions, size, orientation, pageStyle, wrapInPage,
      creator, title, author, subject, keywords } = this.props;

    const resolvedContent = pdfContent
      ? resolveRefs(pdfContent, {
          definitions: definitions || {},
          props: this.props,
          state: this.state,
        })
      : null;

    const builtContent = this.buildPdfContent(resolvedContent);

    const docProps: Record<string, any> = {};
    if (creator) docProps.creator = creator;
    if (title) docProps.title = title;
    if (author) docProps.author = author;
    if (subject) docProps.subject = subject;
    if (keywords) docProps.keywords = keywords;

    const pageProps: Record<string, any> = {};
    if (size) pageProps.size = size;
    if (orientation) pageProps.orientation = orientation;
    if (pageStyle) pageProps.style = this.resolveStyles(pageStyle);

    if (wrapInPage) {
      return React.createElement(Document, docProps,
        React.createElement(Page, pageProps,
          React.createElement(View, { style: this.resolveStyles({ padding: 40 }) },
            builtContent
          )
        )
      );
    }

    return React.createElement(Document, docProps, builtContent);
  }
}
