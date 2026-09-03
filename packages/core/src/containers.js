"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addContainers = void 0;
const components_1 = require("./components");
const container_1 = __importDefault(require("./containers/container"));
const details_container_1 = __importDefault(require("./containers/details-container"));
const form_container_1 = __importDefault(require("./containers/form-container"));
const goat_container_1 = __importDefault(require("./containers/goat-container"));
const grid_container_1 = __importDefault(require("./containers/grid-container"));
const list_container_1 = __importDefault(require("./containers/list-container"));
const auto_responsive_container_1 = __importDefault(require("./containers/auto-responsive-container"));
const fullscreen_container_1 = __importDefault(require("./containers/fullscreen-container"));
const proportional_container_1 = __importDefault(require("./containers/proportional-container"));
const scroll_container_1 = __importDefault(require("./containers/scroll-container"));
const CONTAINERS = {
    Container: container_1.default,
    DetailsContainer: details_container_1.default,
    FormContainer: form_container_1.default,
    GoatContainer: goat_container_1.default,
    GridContainer: grid_container_1.default,
    ListContainer: list_container_1.default,
    AutoResponsiveContainer: auto_responsive_container_1.default,
    FullscreenContainer: fullscreen_container_1.default,
    ProportionalContainer: proportional_container_1.default,
    ScrollContainer: scroll_container_1.default
};
const addContainers = (containers) => {
    Object.assign(CONTAINERS, containers);
    (0, components_1.addComponents)(containers);
};
exports.addContainers = addContainers;
exports.default = CONTAINERS;
//# sourceMappingURL=containers.js.map