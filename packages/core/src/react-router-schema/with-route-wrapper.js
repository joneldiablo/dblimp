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
const react_1 = __importStar(require("react"));
const react_router_dom_1 = require("react-router-dom");
const event_handler_1 = __importDefault(require("dbl-utils/event-handler"));
/**
 * Higher-order component to manage class names and styles in the body element
 * based on the current route and its properties.
 *
 * @param {React.ComponentType<P>} WrappedComponent - The component to wrap (Controller).
 * @param {Route} route - The current route object containing name, style, and other properties.
 * @returns {React.FC<P>} - The wrapped component with added functionality.
 */
const withRouteWrapper = (WrappedComponent, route) => {
    return function RouteWrapper(props) {
        const location = (0, react_router_dom_1.useLocation)();
        const navigate = (0, react_router_dom_1.useNavigate)();
        const params = (0, react_router_dom_1.useParams)();
        // Reference used to hold the timeout ID when throttling location updates
        const timeoutRef = (0, react_1.useRef)(null);
        // useReducer is used here to provide a stable forceUpdate function that
        // increments an integer. React's forceUpdate method is not available in
        // function components, so this pattern emulates it.
        const [, forceUpdate] = (0, react_1.useReducer)((x) => x + 1, 0);
        // Subscribe to location events emitted via eventHandler…
        (0, react_1.useLayoutEffect)(() => {
            var _a;
            const callback = (nlocation) => {
                // Clear any pending timeout to debounce updates
                if (timeoutRef.current)
                    clearTimeout(timeoutRef.current);
                timeoutRef.current = setTimeout(() => {
                    if (nlocation.pathname !== location.pathname)
                        forceUpdate();
                }, 50);
            };
            // Use the route name from props if available when subscribing so that
            // each wrapper has a unique subscription key.
            event_handler_1.default.subscribe("location", callback, "wrapper-" + ((_a = props.name) !== null && _a !== void 0 ? _a : ""));
            return () => {
                var _a;
                event_handler_1.default.unsubscribe("location", "wrapper-" + ((_a = props.name) !== null && _a !== void 0 ? _a : ""));
                if (timeoutRef.current)
                    clearTimeout(timeoutRef.current);
            };
        }, []);
        // Update body classes and CSS variables whenever the pathname changes…
        (0, react_1.useLayoutEffect)(() => {
            // Remove any existing class ending with '-view' before adding the new one
            const viewClassName = Array.from(document.body.classList).find((cl) => cl.endsWith("-view"));
            if (viewClassName) {
                document.body.classList.remove(viewClassName);
            }
            document.body.classList.add(`${route.name}-view`);
            // Remove classes that start with 'location-' and then add our own
            document.body.classList.forEach((cls) => {
                if (cls.startsWith("location-")) {
                    document.body.classList.remove(cls);
                }
            });
            document.body.classList.add(`location${location.pathname.replace(/\//g, "-")}`);
            // Ensure route.style exists and set a CSS custom property to expose the
            // component name.
            if (!route.style)
                route.style = {};
            route.style["--component-name"] = `"${route.name}"`;
            // Cleanup when the component unmounts or the pathname changes
            return () => {
                document.body.classList.remove(`${route.name}-view`);
                document.body.classList.remove(`location${location.pathname.replace(/\//g, "-")}`);
            };
        }, [location.pathname]);
        return (react_1.default.createElement(WrappedComponent, { ...props, location: location, navigate: navigate, match: params, route: route }));
    };
};
exports.default = withRouteWrapper;
//# sourceMappingURL=with-route-wrapper.js.map