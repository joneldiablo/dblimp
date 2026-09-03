"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const utils_1 = require("dbl-utils/utils");
const component_1 = __importDefault(require("../component"));
class Image extends component_1.default {
    constructor() {
        super(...arguments);
        this.tag = "figure";
        this.classes = "";
    }
    content() {
        const { src, alt, children, width, height, objectFit, objectPosition, imageClasses, contentProps } = this.props;
        let imgSrc = typeof src === "object" ? src.default || "" : src || "";
        return (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement("picture", null,
                src && typeof src === "object" &&
                    Object.keys(src).map((min) => (react_1.default.createElement("source", { key: min, srcSet: src[min], media: `(min-width: ${min}px)` }))),
                react_1.default.createElement("img", { src: imgSrc, alt: alt, width: width, height: height, style: { objectFit, objectPosition }, className: (0, utils_1.splitAndFlat)([imageClasses], " ").join(" ") })),
            react_1.default.createElement("figcaption", { ...contentProps }, children)));
    }
}
Image.jsClass = "Image";
Image.defaultProps = {
    ...component_1.default.defaultProps,
    objectFit: "cover",
    objectPosition: "center",
    imageClasses: "",
    width: "100%",
    style: {
        overflow: "hidden",
    },
};
exports.default = Image;
//# sourceMappingURL=image.js.map