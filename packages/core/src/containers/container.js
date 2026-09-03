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
const ResizeSensor_1 = __importDefault(require("css-element-queries/src/ResizeSensor"));
const event_handler_1 = __importDefault(require("dbl-utils/event-handler"));
const component_1 = __importDefault(require("../component"));
class Container extends component_1.default {
    constructor(props) {
        super(props);
        this.breakpoint = undefined;
        this.width = 0;
        this.height = 0;
        this.waitBreakpoint = (react_1.default.createElement("svg", { className: "spinner", width: "24", height: "24", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg" },
            react_1.default.createElement("style", null, `.spinner-anim { transform-origin: center; animation: spin 1s linear infinite; } @keyframes spin { 100% { transform: rotate(360deg); } }`),
            react_1.default.createElement("path", { className: "spinner-anim", d: "M12 4a8 8 0 018 8h-2a6 6 0 00-6-6V4z", fill: "currentColor" })));
        this.state = this.state;
        this.ref = (0, react_1.createRef)();
        this.onResize = this.onResize.bind(this);
    }
    get componentProps() {
        return {
            id: this.props.name,
            ...this.props._props,
        };
    }
    updateSize() {
        var _a, _b;
        const { fluid, fullWidth } = this.props;
        const containerType = !fullWidth
            ? fluid
                ? "container-fluid"
                : "container"
            : "";
        const baseClasses = new Set(this.state.localClasses.split(" "));
        Object.keys((_a = this.props.breakpoints) !== null && _a !== void 0 ? _a : {}).forEach((br) => baseClasses.delete(br));
        [containerType, this.breakpoint, "animate"].forEach((c) => c && baseClasses.add(c));
        const classesKey = (((_b = this.breakpoint) !== null && _b !== void 0 ? _b : "") +
            "Classes");
        this.addClasses(this.props[classesKey]);
        this.setState({
            localClasses: Array.from(baseClasses).join(" "),
        });
    }
    onResize(firstTime) {
        const resizingFunc = () => {
            var _a;
            if (!this.ref.current)
                return;
            let width, height;
            if (firstTime === true) {
                ({ offsetWidth: width, offsetHeight: height } = this.ref.current);
            }
            else if (typeof firstTime === "object") {
                ({ width, height } = firstTime);
            }
            else {
                return;
            }
            this.breakpoint = Object.keys((_a = this.props.breakpoints) !== null && _a !== void 0 ? _a : {})
                .filter((br) => { var _a, _b; return width >= ((_b = (_a = this.props.breakpoints) === null || _a === void 0 ? void 0 : _a[br]) !== null && _b !== void 0 ? _b : 0); })
                .pop();
            this.orientation = width >= height ? "landscape" : "portrait";
            this.width = width;
            this.height = height;
            const resp = {
                width,
                height,
                breakpoint: this.breakpoint,
                orientation: this.orientation,
            };
            if (typeof this.props.onResize === "function") {
                this.props.onResize(resp);
            }
            event_handler_1.default.dispatch(`resize.${this.props.name}`, resp);
            this.updateSize();
        };
        if (firstTime === true) {
            resizingFunc();
            event_handler_1.default.dispatch(`ready.${this.props.name}`);
        }
        else {
            clearTimeout(this.onResizeTimeout);
            this.onResizeTimeout = setTimeout(resizingFunc, 200);
        }
    }
    componentDidUpdate(prevProps) {
        if (prevProps.fluid !== this.props.fluid ||
            prevProps.fullWidth !== this.props.fullWidth) {
            this.updateSize();
        }
    }
    componentDidMount() {
        if (this.ref.current) {
            this.resizeSensor = new ResizeSensor_1.default(this.ref.current, this.onResize);
        }
        this.onResize(true);
    }
    componentWillUnmount() {
        var _a;
        clearTimeout(this.onResizeTimeout);
        (_a = this.resizeSensor) === null || _a === void 0 ? void 0 : _a.detach();
    }
    content(children = this.props.children) {
        return this.breakpoint ? children : this.waitBreakpoint;
    }
}
Container.jsClass = "Container";
Container.defaultProps = {
    ...component_1.default.defaultProps,
    fluid: true,
    fullWidth: false,
    breakpoints: {
        xs: 0,
        sm: 576,
        md: 768,
        lg: 992,
        xl: 1200,
        xxl: 1400,
    },
};
exports.default = Container;
//# sourceMappingURL=container.js.map