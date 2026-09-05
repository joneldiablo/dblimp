import React from "react";
import Component, { ComponentProps } from "./component";
import { addComponents } from "./component-registry";

import Container from "./containers/container";
import DetailsContainer from "./containers/details-container";
import FormContainer from "./containers/form-container";
import JsonRenderContainer from "./containers/json-render-container";
import GridContainer from "./containers/grid-container";
import ListContainer from "./containers/list-container";
import AutoResponsiveContainer from "./containers/auto-responsive-container";
import FetchContainer from "./containers/fetch-container";
import FlexContainer from "./containers/flex-container";
import FullscreenContainer from "./containers/fullscreen-container";
import GridSwitchContainer from "./containers/grid-switch-container";
import ProportionalContainer from "./containers/proportional-container";
import ScrollContainer from "./containers/scroll-container";

const CONTAINERS: Record<
  string,
  | typeof Container<any, any>
  | React.FC<ComponentProps>
  | typeof Component<any, any>
  | typeof React.Component<any, any>
> = {
  Container,
  DetailsContainer,
  FetchContainer,
  FlexContainer,
  FormContainer,
  JsonRenderContainer,
  GridContainer,
  GridSwitchContainer,
  ListContainer,
  AutoResponsiveContainer,
  FullscreenContainer,
  ProportionalContainer,
  ScrollContainer
};

export const addContainers = (containers: Record<string, typeof Container> | React.FC<ComponentProps>) => {
  Object.assign(CONTAINERS, containers);
  addComponents(containers as Record<string, typeof Component<any, any>>);
}

addComponents(CONTAINERS as Record<string, React.FC<any> | typeof Component<any, any>>);

export default CONTAINERS;