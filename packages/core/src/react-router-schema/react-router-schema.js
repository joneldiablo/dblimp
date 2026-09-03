"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HashRouterSchema = exports.BrowserRouterSchema = void 0;
const react_1 = __importStar(require("react"));
const react_router_dom_1 = require("react-router-dom");
const event_handler_1 = __importDefault(require("dbl-utils/event-handler"));
const utils_1 = require("dbl-utils/utils");
const controllers_1 = __importDefault(require("../controllers"));
const with_route_wrapper_1 = __importDefault(require("./with-route-wrapper"));
const defaultProps = {
    defaultController: controllers_1.default.Controller,
};
class SchemaController extends react_1.default.Component {
    constructor(props) {
        super(props);
        this.routeNodes = [];
        this.views = (route, i) => {
            const Controller = controllers_1.default[route.component] ||
                this.props.defaultController ||
                controllers_1.default.Controller;
            route.test = route.test || this.props.test;
            const WrappedController = (0, with_route_wrapper_1.default)(Controller, route);
            let subroutes = false;
            if (Array.isArray(route.routes))
                subroutes = [];
            else if (typeof route.routes === "object") {
                subroutes = [];
                const routesRecord = route.routes;
                route.routes = Object.keys(routesRecord).map((name) => ({ name, ...routesRecord[name] }));
            }
            if (subroutes) {
                subroutes = route.routes.map((subRoute, i) => this.views(subRoute, i));
            }
            const routeProps = {
                path: route.path,
                index: route.index,
                action: route.action,
                caseSensitive: route.caseSensitive,
                Component: route.Component,
                ErrorBoundary: route.ErrorBoundary,
                errorElement: route.errorElement,
                handle: route.handle,
                hasErrorBoundary: route.hasErrorBoundary,
                HydrateFallback: route.HydrateFallback,
                hydrateFallbackElement: route.hydrateFallbackElement,
                id: route.id,
                lazy: route.lazy,
                loader: route.loader,
                shouldRevalidate: route.shouldRevalidate,
                element: (react_1.default.createElement(WrappedController, { ...route }, subroutes.length > 0 ? react_1.default.createElement(react_router_dom_1.Outlet, null) : null)),
            };
            const key = i || typeof i === "number" ? i + "-" + route.name : route.name;
            return (react_1.default.createElement(react_router_dom_1.Route, { key: key, ...routeProps }, subroutes.length > 0 && subroutes));
        };
        // Initialize the routes hash so we can detect schema changes on updates
        // We hash the incoming routes so that deep changes are detected. This mirrors
        // the behaviour of the JS implementation in dbl-components where the hash
        // is stored up front.
        this.routesHash = (0, utils_1.hash)(JSON.stringify(props.routes));
        this.buildRoutes();
    }
    buildRoutes() {
        const schemaStr = JSON.stringify(this.props.routes);
        const routesSchema = JSON.parse(schemaStr);
        let routes;
        if (Array.isArray(routesSchema))
            routes = routesSchema.map(this.views);
        else if (typeof routesSchema === "object" && routesSchema.name)
            routes = this.views(routesSchema);
        else if (typeof routesSchema === "object")
            routes = Object.keys(routesSchema).map((name, i) => this.views({ name, ...routesSchema[name] }, i));
        this.routeNodes = routes;
        // Update the stored hash whenever we rebuild the routes so that
        // componentDidUpdate can compare against it.
        this.routesHash = (0, utils_1.hash)(JSON.stringify(this.props.routes));
    }
    componentDidUpdate(prevProps) {
        // Recalculate the hash for the current routes and compare with the
        // previously stored value. If the schema has changed then rebuild
        // our internal representation and force a re-render. Without
        // forceUpdate the updates to routeNodes (a class property) would not
        // trigger a re-render in React.
        const newHash = (0, utils_1.hash)(JSON.stringify(this.props.routes));
        if (this.routesHash !== newHash) {
            this.buildRoutes();
            // forceUpdate ensures the component re-renders when the routes
            // change. This mirrors the behaviour of the original implementation
            // in dbl-components.
            this.forceUpdate();
        }
    }
    render() {
        const { theme } = this.props;
        if (this.props.forceRebuild) {
            this.buildRoutes();
        }
        return (react_1.default.createElement(react_1.default.Fragment, null,
            !!theme && react_1.default.createElement("link", { rel: "stylesheet", type: "text/css", href: theme }),
            react_1.default.createElement(react_router_dom_1.Routes, null, this.routeNodes)));
    }
}
SchemaController.jsClass = "SchemaController";
SchemaController.defaultProps = defaultProps;
exports.default = SchemaController;
const RouterSchema = (props) => {
    const location = (0, react_router_dom_1.useLocation)();
    (0, react_1.useEffect)(() => {
        event_handler_1.default.dispatch("location", location);
    }, [location.pathname]);
    return react_1.default.createElement(SchemaController, { ...props });
};
const BrowserRouterSchema = (props) => {
    const mergedProps = { ...defaultProps, ...props };
    return (react_1.default.createElement(react_router_dom_1.BrowserRouter, null,
        react_1.default.createElement(RouterSchema, { ...mergedProps })));
};
exports.BrowserRouterSchema = BrowserRouterSchema;
const HashRouterSchema = (props) => {
    const mergedProps = { ...defaultProps, ...props };
    return (react_1.default.createElement(react_router_dom_1.HashRouter, null,
        react_1.default.createElement(RouterSchema, { ...mergedProps })));
};
exports.HashRouterSchema = HashRouterSchema;
//# sourceMappingURL=react-router-schema.js.map