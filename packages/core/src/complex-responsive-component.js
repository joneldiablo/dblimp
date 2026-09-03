"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ResizeSensor_1 = __importDefault(require("css-element-queries/src/ResizeSensor"));
const dbl_utils_1 = require("dbl-utils");
const complex_component_1 = __importDefault(require("./complex-component"));
/**
 * Extension of {@link ComplexComponent} that reacts to size changes and
 * dispatches a `resize` event with breakpoint information.
 */
class ComplexResponsiveComponent extends complex_component_1.default {
    constructor() {
        super(...arguments);
        /**
         * Handles element resize and updates breakpoint state.
         */
        this.onResize = () => {
            clearTimeout(this.onResizeTimeout);
            this.onResizeTimeout = setTimeout(() => {
                var _a;
                if (!this.ref.current)
                    return;
                const { offsetWidth: width, offsetHeight: height } = this.ref.current;
                if (typeof this.props.onResize === "function") {
                    this.props.onResize({ width, height });
                }
                this.breakpoint = Object.keys((_a = this.props.breakpoints) !== null && _a !== void 0 ? _a : {})
                    .filter((br) => { var _a, _b; return width >= ((_b = (_a = this.props.breakpoints) === null || _a === void 0 ? void 0 : _a[br]) !== null && _b !== void 0 ? _b : 0); })
                    .pop();
                dbl_utils_1.eventHandler.dispatch(`resize.${this.props.name}`, {
                    width,
                    height,
                    breakpoint: this.breakpoint,
                });
                this.setState({
                    localClasses: [this.breakpoint, "animate"].flat().join(" "),
                });
            }, 200);
        };
    }
    componentDidMount() {
        super.componentDidMount();
        if (this.ref)
            this.resizeSensor = new ResizeSensor_1.default(this.ref.current, this.onResize);
        this.onResize();
    }
    componentWillUnmount() {
        var _a;
        super.componentWillUnmount();
        clearTimeout(this.onResizeTimeout);
        (_a = this.resizeSensor) === null || _a === void 0 ? void 0 : _a.detach();
    }
}
ComplexResponsiveComponent.jsClass = "ComplexResponsive";
ComplexResponsiveComponent.defaultProps = {
    ...complex_component_1.default.defaultProps,
    breakpoints: {
        xs: 0,
        sm: 576,
        md: 768,
        lg: 992,
        xl: 1200,
        xxl: 1400,
    },
};
exports.default = ComplexResponsiveComponent;
//# sourceMappingURL=complex-responsive-component.js.map