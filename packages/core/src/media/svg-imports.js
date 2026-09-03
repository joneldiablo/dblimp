"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addSvgs = addSvgs;
const react_1 = __importDefault(require("react"));
const SvgsImported = {};
/**
 * Adds SVG components to the imported collection.
 * @param svgs - An object containing SVG components.
 */
function addSvgs(svgs) {
    Object.assign(SvgsImported, svgs);
}
const SvgImports = ({ id, name, classes, className, class: _class, svg, style, title, }) => {
    const Svg = svg ? SvgsImported[svg] : undefined;
    const cn = [
        Svg ? [name, `${name}-SvgImports`] : "",
        classes,
        className,
        _class,
    ];
    return Svg ? (react_1.default.createElement(Svg, { id: id, className: cn.flat().filter(Boolean).join(" "), style: style, title: title })) : null;
};
exports.default = SvgImports;
//# sourceMappingURL=svg-imports.js.map