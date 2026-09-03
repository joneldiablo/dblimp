"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_router_dom_1 = require("react-router-dom");
const component_1 = __importDefault(require("../component"));
class Route extends component_1.default {
    render() {
        const { active, name, path, index, action, caseSensitive, Component, ErrorBoundary, errorElement, handle, hasErrorBoundary, HydrateFallback, hydrateFallbackElement, id, lazy, loader, shouldRevalidate, children, } = this.props;
        const props = {
            path,
            index,
            action,
            caseSensitive,
            Component,
            ErrorBoundary,
            errorElement,
            handle,
            hasErrorBoundary,
            HydrateFallback,
            hydrateFallbackElement,
            id,
            lazy,
            loader,
            shouldRevalidate,
            element: children,
        };
        return active ? react_1.default.createElement(react_router_dom_1.Route, { key: name, ...props }) : react_1.default.createElement(react_1.default.Fragment, null, false);
    }
}
Route.jsClass = "Route";
Route.wrapper = false;
exports.default = Route;
//# sourceMappingURL=route.js.map