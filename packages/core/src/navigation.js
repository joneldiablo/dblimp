"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addNavigationComponents = void 0;
const components_1 = require("./components");
const react_router_link_1 = __importDefault(require("./navigation/react-router-link"));
const react_router_navlink_1 = __importDefault(require("./navigation/react-router-navlink"));
const NAVIGATION_COMPONENTS = {
    Link: react_router_link_1.default,
    NavLink: react_router_navlink_1.default,
};
const addNavigationComponents = (navigationComponents) => {
    if (!navigationComponents)
        return false;
    Object.assign(NAVIGATION_COMPONENTS, navigationComponents);
    (0, components_1.addComponents)(navigationComponents);
    return true;
};
exports.addNavigationComponents = addNavigationComponents;
exports.default = NAVIGATION_COMPONENTS;
//# sourceMappingURL=navigation.js.map