"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const container_1 = __importDefault(require("./container"));
class ProportionalContainer extends container_1.default {
    constructor(props) {
        super(props);
        this.style = {
            position: "relative",
        };
        this.state = this.state;
    }
    content(children = this.props.children) {
        if (!this.breakpoint)
            return this.waitBreakpoint;
        const { ratio, overflow, innerClasses } = this.props;
        this.ratioResponsive =
            typeof ratio === "object" ? ratio[this.breakpoint] : ratio;
        const paddingBottom = typeof this.ratioResponsive === "number"
            ? `${this.ratioResponsive * 100}%`
            : this.ratioResponsive;
        const st = {
            overflow,
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
        };
        return (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement("div", { className: "space", style: { paddingBottom } }),
            react_1.default.createElement("div", { className: ["inner", innerClasses].flat().join(" "), style: st }, children)));
    }
}
ProportionalContainer.jsClass = "ProportionalContainer";
ProportionalContainer.defaultProps = {
    ...container_1.default.defaultProps,
    ratio: "100%",
    overflow: "hidden",
    fullWidth: true,
};
exports.default = ProportionalContainer;
//# sourceMappingURL=proportional-container.js.map