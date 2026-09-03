"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const container_1 = __importDefault(require("./container"));
class GridContainer extends container_1.default {
    constructor(props) {
        super(props);
        this.state = this.state;
    }
    grid(children = this.props.children, extraClasses) {
        const { colClasses, colTag } = this.props;
        return [children]
            .flat()
            .map((child, i) => {
            var _a, _b, _c, _d, _e;
            if (!child)
                return null;
            let colcn = [i % 2 ? "even" : "odd", "col-num-" + i];
            const childProps = (_c = (((_b = (_a = child.props) === null || _a === void 0 ? void 0 : _a.style) === null || _b === void 0 ? void 0 : _b["--component-name"])
                ? child.props.children
                : child)) === null || _c === void 0 ? void 0 : _c.props;
            const childColClasses = childProps === null || childProps === void 0 ? void 0 : childProps.colClasses;
            if (childColClasses)
                colcn.push(childColClasses);
            if (typeof colClasses === "string")
                colcn.push(colClasses);
            else if (Array.isArray(colClasses)) {
                colcn.push((_d = colClasses[i]) !== null && _d !== void 0 ? _d : colClasses[colClasses.length - 1]);
            }
            if (typeof extraClasses === "string")
                colcn.push(extraClasses);
            else if (Array.isArray(extraClasses)) {
                colcn.push((_e = extraClasses[i]) !== null && _e !== void 0 ? _e : extraClasses[extraClasses.length - 1]);
            }
            const ColTag = (childProps === null || childProps === void 0 ? void 0 : childProps.colTag) || colTag;
            return react_1.default.createElement(ColTag, { className: colcn.flat().join(" "), key: i }, child);
        })
            .filter(Boolean);
    }
    content(children = this.props.children) {
        return super.content(this.grid(children));
    }
}
GridContainer.jsClass = "GridContainer";
GridContainer.defaultProps = {
    ...container_1.default.defaultProps,
    colClasses: [],
    colTag: "div",
};
exports.default = GridContainer;
//# sourceMappingURL=grid-container.js.map