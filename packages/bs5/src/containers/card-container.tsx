import React from "react";

import Container from "./container";
import { ComponentProps } from "../component";

export default class CardContainer extends Container {

  static jsClass = 'CardContainer';
  static defaultProps = {
    ...Container.defaultProps,
    fullWidth: true,
    headerClasses: '',
    bodyClasses: '',
    footerClasses: ''
  }

  classes = 'card';

  constructor(props: ComponentProps) {
    super(props);
  }

  content(children: React.ReactNode[] = this.props.children as React.ReactNode[]) {
    if (!this.breakpoint) return this.waitBreakpoint;
    const theContent: Record<string, any[]> = {
      header: [],
      body: [],
      footer: []
    }
    const { headerClasses,
      bodyClasses,
      footerClasses } = this.props;
    children.forEach((childRaw, i) => {
      const child = childRaw as unknown as { props?: any; type?: any; key?: any };
      if (!child) return;
      const props = (!(child.props?.style && child.props.style['--component-name'])
        ? child : child.props.children).props;

      if (props.header) {
        theContent.header.push(child);
      } else if (props.footer) {
        theContent.footer.push(child);
      } else if (props.container) {
        theContent[props.container].push(child);
      } else {
        theContent.body.push(child);
      }
    });
    const hc = ['card-header'],
      bc = ['card-body'],
      fc = ['card-footer'];

    if (headerClasses) hc.push(headerClasses);
    if (bodyClasses) bc.push(bodyClasses);
    if (footerClasses) fc.push(footerClasses);

    return React.createElement(React.Fragment, {},
      !!theContent.header.length &&
      React.createElement('div', { className: hc.flat().filter(Boolean).join(' ') }, theContent.header),
      React.createElement('div', { className: bc.flat().filter(Boolean).join(' ') }, theContent.body),
      !!theContent.footer.length &&
      React.createElement('div', { className: fc.flat().filter(Boolean).join(' ') }, theContent.footer)
    );
  }

}