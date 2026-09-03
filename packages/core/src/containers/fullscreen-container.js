"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const component_1 = __importDefault(require("../component"));
class FullscreenContainer extends component_1.default {
    constructor(props) {
        super(props);
        this.style = {};
        this.state = this.state;
    }
    content(children = this.props.children) {
        const { overflow, gutter } = this.props;
        this.style = {
            ...this.style,
            overflow,
            height: gutter ? `calc(100vh - ${gutter}px)` : "100vh",
        };
        return children;
    }
}
FullscreenContainer.jsClass = "FullscreenContainer";
FullscreenContainer.defaultProps = {
    ...component_1.default.defaultProps,
    overflow: "hidden",
    gutter: 0,
};
exports.default = FullscreenContainer;
//# sourceMappingURL=fullscreen-container.js.map