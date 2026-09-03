"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_router_dom_1 = require("react-router-dom");
const component_1 = __importDefault(require("../component"));
class Link extends component_1.default {
    constructor() {
        super(...arguments);
        this.tag = react_router_dom_1.Link;
    }
    get componentProps() {
        const { to, replace, ref, target, _component } = this.props;
        return {
            to,
            replace,
            ref,
            target,
            component: _component,
        };
    }
}
Link.jsClass = "Link";
exports.default = Link;
//# sourceMappingURL=react-router-link.js.map