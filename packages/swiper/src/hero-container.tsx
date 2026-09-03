import React, { ReactNode } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import { Container, ContainerProps, ContainerState, deepMerge } from "@dblimp/core";

export interface HeroContainerProps extends ContainerProps {
  spaceBetween?: number;
  slidesPerView?: number;
  autoplayDelay?: number;
  swiperprops?: Record<string, any>;
}

export interface HeroContainerState extends ContainerState {}

/**
 * Hero slider container powered by Swiper.
 */
export default class HeroContainer extends Container<
  HeroContainerProps,
  HeroContainerState
> {
  static override jsClass = "HeroContainer";

  static override defaultProps: Partial<HeroContainerProps> = {
    ...Container.defaultProps,
    fullWidth: true,
    fluid: false,
    spaceBetween: 0,
    slidesPerView: 1,
  };

  onSlideChange = (): void => {};

  onSwiper = (_swipe: any): void => {};

  override content(children: any = this.props.children): any {
    if (!this.breakpoint) return this.waitBreakpoint;

    const { spaceBetween, slidesPerView, autoplayDelay, swiperprops } =
      this.props;

    const propsSwiper: Record<string, any> = {
      spaceBetween,
      slidesPerView,
      modules: [Autoplay],
      autoplay: {
        delay: autoplayDelay || 6000,
        disableOnInteraction: false,
      },
      onSlideChange: this.onSlideChange,
      onSwiper: this.onSwiper,
    };

    const slides = React.Children.toArray(children);
    if (slides.length < 2) {
      Object.assign(propsSwiper, {
        resistance: true,
        resistanceRatio: 0,
      });
    }

    if (typeof swiperprops === "object") {
      deepMerge(propsSwiper, swiperprops);
    }

    return (
      <Swiper {...propsSwiper}>
        {slides
          .map((slide: any, i: number) => {
            if (!slide) return null;

            const slideProps = (
              !(slide.props?.style && slide.props.style["--component-name"])
                ? slide
                : slide.props.children
            ).props || {};

            return (
              <SwiperSlide
                key={i}
                style={{
                  backgroundImage: slideProps.image
                    ? `url("${slideProps.image}")`
                    : undefined,
                  backgroundAttachment: slideProps.imageAttachment,
                }}
              >
                {slide}
              </SwiperSlide>
            );
          })
          .filter(Boolean)}
      </Swiper>
    );
  }
}
