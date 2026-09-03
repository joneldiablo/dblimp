"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const controller_1 = __importDefault(require("./controller"));
/**
 * Controller that renders an `<h1>` before its child content.
 */
class TitleController extends controller_1.default {
    /**
     * Renders the heading and delegates the remaining content to the parent.
     */
    content(children = this.props.children) {
        const { label, labelClasses } = this.props;
        return (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement("h1", { className: labelClasses }, label),
            super.content(children)));
    }
}
TitleController.jsClass = "TitleController";
exports.default = TitleController;
//# sourceMappingURL=title-controller.js.map