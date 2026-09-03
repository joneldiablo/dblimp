"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
class Svg extends react_1.default.Component {
    render() {
        const { style, href, className, classes, inline, ...props } = this.props;
        // Construcción de clases CSS
        const cn = [Svg.jsClass];
        if (className)
            cn.push(...(Array.isArray(className) ? className : [className]));
        if (classes)
            cn.push(...(Array.isArray(classes) ? classes : [classes]));
        if (inline)
            cn.push("icon-inline");
        return (react_1.default.createElement("svg", { className: cn.filter(Boolean).join(" "), style: style, ...props },
            react_1.default.createElement("use", { href: href })));
    }
}
Svg.jsClass = "Svg";
Svg.defaultProps = {
    className: "",
    classes: "",
    href: "",
    inline: true,
    style: {},
};
exports.default = Svg;
//# sourceMappingURL=svg.js.map