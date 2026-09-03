import { addComponents } from "@dblimp/core";

import ArticlesList from "./components/articles-list/articles-list";
import BlogPost from "./components/blog-post/blog-post";
import CalendarField from "./components/calendar-field/calendar-field";
import CardNavigation from "./components/card-navigation/card-navigation";
import CardPanelNavigation from "./components/card-panel-navigation/card-panel-navigation";
import CardPlans from "./components/card-plans/card-plans";
import CardService from "./components/card-service/card-service";
import CmsTemplate from "./components/_template/_template";
import EndpointLoader from "./components/endpoint-loader/endpoint-loader";
import HeaderBlog from "./components/header-blog/header-blog";
import Image from "./components/image";
import Notifications from "./components/notifications/notifications";
import OpeningHours from "./components/opening-hours/opening-hours";

export {
  ArticlesList,
  BlogPost,
  CalendarField,
  CardNavigation,
  CardPanelNavigation,
  CardPlans,
  CardService,
  CmsTemplate,
  EndpointLoader,
  HeaderBlog,
  Image,
  Notifications,
  OpeningHours,
};

export * from "./utils";
export * from "./utils/assets";
export * from "./utils/find-scrollable-parent";

export const CMS_COMPONENTS = {
  ArticlesList,
  BlogPost,
  CalendarField,
  CardNavigation,
  CardPanelNavigation,
  CardPlans,
  CardService,
  CmsTemplate,
  EndpointLoader,
  HeaderBlog,
  Image,
  Notifications,
  OpeningHours,
};

/**
 * Registers the CMS components (and the base registry types they depend on)
 * into the Goat/schema component registry. Call this once, e.g. when
 * importing the package.
 */
export const registerCmsComponents = (): boolean => {
  addComponents(CMS_COMPONENTS);
  return true;
};

export default CMS_COMPONENTS;