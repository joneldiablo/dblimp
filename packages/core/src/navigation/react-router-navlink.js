"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_router_dom_1 = require("react-router-dom");
const component_1 = __importDefault(require("../component"));
class NavLink extends component_1.default {
    constructor() {
        super(...arguments);
        this.tag = react_router_dom_1.NavLink;
    }
    get componentProps() {
        const { ariaCurrent, to, replace, ref, end, _component } = this.props;
        return {
            "aria-current": ariaCurrent,
            to,
            replace,
            ref,
            end,
            component: _component,
        };
    }
}
NavLink.jsClass = "NavLink";
exports.default = NavLink;
//# sourceMappingURL=react-router-navlink.js.map