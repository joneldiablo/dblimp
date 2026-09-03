"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const container_1 = __importDefault(require("./container"));
class ListContainer extends container_1.default {
    constructor(props) {
        super(props);
        this.state = this.state;
    }
    li(children = this.props.children, extraClasses) {
        const { liClasses } = this.props;
        return [children]
            .flat()
            .map((child, i) => {
            var _a, _b, _c, _d, _e;
            if (!child)
                return null;
            let licn = [i % 2 ? "even" : "odd", `li-num-${i}`];
            const theChildConf = (_c = (((_b = (_a = child.props) === null || _a === void 0 ? void 0 : _a.style) === null || _b === void 0 ? void 0 : _b["--component-name"])
                ? child.props.children
                : child)) === null || _c === void 0 ? void 0 : _c.props;
            const childLiClasses = theChildConf === null || theChildConf === void 0 ? void 0 : theChildConf.liClasses;
            if (childLiClasses)
                licn.push(childLiClasses);
            if (typeof liClasses === "string")
                licn.push(liClasses);
            else if (Array.isArray(liClasses)) {
                licn.push((_d = liClasses[i]) !== null && _d !== void 0 ? _d : liClasses[liClasses.length - 1]);
            }
            if (typeof extraClasses === "string")
                licn.push(extraClasses);
            else if (Array.isArray(extraClasses)) {
                licn.push((_e = extraClasses[i]) !== null && _e !== void 0 ? _e : extraClasses[extraClasses.length - 1]);
            }
            return (react_1.default.createElement("li", { className: licn.flat().join(" "), key: i }, child));
        })
            .filter(Boolean);
    }
    content(children = this.props.children) {
        return super.content(this.li(children));
    }
}
ListContainer.jsClass = "ListContainer";
ListContainer.defaultProps = {
    ...container_1.default.defaultProps,
    liClasses: [],
    fullWidth: true,
    tag: "ul",
};
exports.default = ListContainer;
//# sourceMappingURL=list-container.js.map