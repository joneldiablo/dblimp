//globals
import "moment/locale/es-mx";

//dbl
import { eventHandler, appCtrl, Image } from "@dblimp/core";
import { addIcons, Icons } from "@dblimp/icomoon";

//schemas - definitions
import globalDefinitions from "./schemas/definitions/global-definitions.json";
import navigationDefinitions from "./schemas/definitions/navigation-schema.json";
import rootTemplate from "./schemas/definitions/root-template.json";

//schemas - root & routes
import rootSchema from "./schemas/root-schema.json";
import homeRoute from "./schemas/routes/home.json";
import galleryRoute from "./schemas/routes/gallery.json";
import iconsRoute from "./schemas/routes/icons.json";
import svgsRoute from "./schemas/routes/svgs.json";
import bootstrapPreviewRoute from "./schemas/routes/bootstrap-preview.json";
import screenPreviewRoute from "./schemas/routes/screen-preview.json";

//utils
import { resolveSrc } from "./utils";

//controllers
import RootController from "./controllers/root-controller";
import HomeController from "./controllers/home-controller";
import GalleryController from "./controllers/gallery-controller";
import ScreenPreviewController from "./controllers/screen-preview-controller";

//components
import ScreenSelector from "./components/screen-selector/screen-selector";
import InlineSvg from "./components/inline-svg/inline-svg";
import HeroBanner from "./components/hero-banner/hero-banner";

const images = {
  placeholderHero: resolveSrc("/assets/placeholder-hero.svg"),
  placeholderLogo: resolveSrc("/assets/placeholder-logo.svg"),
  gallery1: resolveSrc("/assets/gallery-1.svg"),
  gallery2: resolveSrc("/assets/gallery-2.svg"),
};

const imageEntries = () =>
  Object.entries(images).map(([id, src]) => ({ id, src }));

const iconEntries = (icons: { icons: any[] }) =>
  icons.icons.map((icon) => icon.properties.name);

const svgEntries = (svgs: Record<string, any>) =>
  Object.entries(svgs).map(([name, svg]) => ({ name, svg }));

const getApiBaseUrl = () => {
  const baseUrl =
    process.env.REACT_APP_API === "/"
      ? window.location.origin
      : process.env.REACT_APP_API?.trim();

  if (!baseUrl) return window.location.origin;
  return baseUrl.replace(/\/+$/, "");
};

const normalizeApiPath = (url: string) => {
  const normalizedUrl = url.trim().replace(/^\/+/, "");

  if (!normalizedUrl) return "api";
  return normalizedUrl.startsWith("api/") || normalizedUrl === "api"
    ? normalizedUrl
    : `api/${normalizedUrl}`;
};

const buildInitOptions = (definitions: any[]) => ({
  definitions,
  components: {
    ScreenSelector,
    InlineSvg,
    HeroBanner,
    Icons,
    Image,
  },
  controllers: {
    RootController,
    HomeController,
    GalleryController,
    ScreenPreviewController,
  },
  schema: rootSchema,
  routes: [
    homeRoute,
    galleryRoute,
    iconsRoute,
    svgsRoute,
    bootstrapPreviewRoute,
    screenPreviewRoute,
  ],
  api: getApiBaseUrl(),
  apiHeaders: process.env.REACT_APP_API_HEADERS,
  lang: "es-MX",
  dictionary: {
    "es-MX": {
      Search: "Buscar",
      Gallery: "Galería",
      Icons: "Íconos",
      SVGs: "SVGs",
      "Bootstrap Preview": "Vista previa Bootstrap",
      "Screen Preview": "Previsualización de pantallas",
      Home: "Inicio",
    },
    default: {
      Search: "Search",
    },
  },
  initialState: {
    starter: {
      projectName: "dbl-seed",
    },
  },
});

// Resolves once appCtrl.init has run (assests + schemas ready).
export const appReady: Promise<void> = Promise.all([
  Promise.all([
    fetch(resolveSrc("/assets/placeholder-logo.svg") as string)
      .then((res) => res.text())
      .then((s) => ({ placeholderLogo: s }))
      .catch(() => undefined),
    fetch(resolveSrc("/assets/placeholder-hero.svg") as string)
      .then((res) => res.text())
      .then((s) => ({ placeholderHero: s }))
      .catch(() => undefined),
  ]).then((svgParts) => Object.assign({}, ...svgParts)),
  fetch("/icons/selection.json")
    .then((res) => res.json())
    .then((icons) => {
      try {
        addIcons(icons);
      } catch (e) {
        console.error(e);
      }
      return icons;
    }),
])
  .then(([svgs, icons]: [Record<string, string>, { icons: any[] }]) => {
    const originalFetch = appCtrl.fetch.bind(appCtrl);
    type FetchOptions = Parameters<typeof appCtrl.fetch>[1];
    appCtrl.fetch = ((url: string, options: FetchOptions = {}) =>
      originalFetch(normalizeApiPath(url), options)) as unknown as typeof appCtrl.fetch;

    appCtrl.init(
      buildInitOptions([
        globalDefinitions,
        navigationDefinitions,
        rootTemplate,
        { images, imagesArr: imageEntries() },
        { iconsArr: iconEntries(icons), svgsArr: svgEntries(svgs) },
      ])
    );

    eventHandler.dispatch("assetsLoaded");
  })
  .catch((err: unknown) => {
    console.error("Error loading assets", err);
    appCtrl.init(
      buildInitOptions([
        globalDefinitions,
        navigationDefinitions,
        rootTemplate,
        { images, imagesArr: imageEntries() },
      ])
    );
    eventHandler.dispatch("assetsLoaded");
  });

export default appCtrl;