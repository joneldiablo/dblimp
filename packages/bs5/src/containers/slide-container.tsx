import React from "react";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import Container from "./container";

export interface SlideContainerProps {
  options?: Record<string, any>;
  slideClasses?: string;
}

export default class SlideContainer extends Container<SlideContainerProps> {
  static jsClass = 'SlideContainer';
  static defaultProps: Partial<SlideContainerProps> = {
    ...Container.defaultProps,
    options: {},
    slideClasses: ''
  };

  content(children: React.ReactNode = this.props.children): React.ReactNode {
    const { options, slideClasses } = this.props;
    const slides = React.Children.map(children, (child, i) => (
      <SplideSlide className={slideClasses} key={i}>{child}</SplideSlide>
    ));
    return <Splide options={options}>{slides}</Splide>;
  }
}
