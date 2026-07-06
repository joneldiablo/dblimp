import AlertContainer from "./alert-container/alert-container";
import CardContainer from "./card-container";
import ModalContainer from "./modal-container";
import OffcanvasContainer from "./offcanvas/offcanvas";
import PanelContainer from "./panel-container/panel-container";
import GridContainer from "./grid-container";
import TabsContainer from "./tabs-container";
import ScrollContainer from "./scroll-container";
import SlideContainer from "./slide-container";
import FooterContainer from "./footer-container";
import ModalButtonContainer from "./modal-button-container";
import DropdownButtonContainer from "./dropdown-button-container";

const CONTAINERS = {
  AlertContainer,
  CardContainer,
  ModalContainer,
  OffcanvasContainer,
  PanelContainer,
  GridContainer,
  TabsContainer,
  ScrollContainer,
  SlideContainer,
  FooterContainer,
  ModalButtonContainer,
  DropdownButtonContainer,
};

export const addContainers = (newContainers: Record<string, any>) => {
  Object.assign(CONTAINERS, newContainers);
};

export {
  AlertContainer,
  CardContainer,
  ModalContainer,
  OffcanvasContainer,
  PanelContainer,
  GridContainer,
  TabsContainer,
  ScrollContainer,
  SlideContainer,
  FooterContainer,
  ModalButtonContainer,
  DropdownButtonContainer,
};

export default CONTAINERS;
