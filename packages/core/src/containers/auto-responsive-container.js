"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const utils_1 = require("dbl-utils/utils");
const component_1 = __importDefault(require("../component"));
class AutoResponsiveContainer extends component_1.default {
    constructor(props) {
        super(props);
        this.wrapper = react_1.default.createRef();
        this.state = { ...this.state, id: `arc-${(0, utils_1.randomS4)()}` };
    }
    render() {
        const { className, style, children } = this.props;
        const { id } = this.state;
        const cn = [AutoResponsiveContainer.jsClass, className]
            .filter(Boolean)
            .join(" ");
        return (react_1.default.createElement("div", { id: id, ref: this.wrapper, className: cn, style: style }, children));
    }
}
AutoResponsiveContainer.jsClass = "AutoResponsiveContainer";
exports.default = AutoResponsiveContainer;
//# sourceMappingURL=auto-responsive-container.js.map