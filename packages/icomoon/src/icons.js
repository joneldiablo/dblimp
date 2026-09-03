"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchIcon = exports.addIcons = exports.setIconSet = void 0;
const react_1 = __importDefault(require("react"));
const react_icomoon_1 = __importStar(require("react-icomoon"));
const core_1 = require("@dblimp/core");
const selection_json_1 = __importDefault(require("./app-icons-v1.0/selection.json"));
let is = JSON.parse(JSON.stringify(selection_json_1.default));
class Icons extends react_1.default.Component {
    render() {
        let { inline, icon, classes, className, style, width, height, title, size } = this.props;
        icon = (0, exports.searchIcon)(icon) ? icon : "src-error";
        let cn = [Icons.jsClass, icon];
        if (className)
            cn.push(className);
        if (classes)
            cn.push(classes);
        if (inline) {
            cn.push("icon-inline");
        }
        else {
            style = { ...style, display: "block" };
        }
        const props = {
            icon: icon,
            iconSet: is,
            className: (0, core_1.splitAndFlat)(cn, " ").join(" "),
            style,
            width,
            height,
            title,
            size
        };
        return react_1.default.createElement(react_icomoon_1.default, { ...props });
    }
}
Icons.jsClass = "Icons";
Icons.defaultProps = {
    inline: true,
    className: "",
    icon: null,
    style: {}
};
exports.default = Icons;
const setIconSet = (isIn) => {
    is = isIn;
};
exports.setIconSet = setIconSet;
const addIcons = (newSet) => {
    is.icons.push(...newSet.icons);
};
exports.addIcons = addIcons;
const searchIcon = (icon) => {
    if (!icon)
        return undefined;
    let list = (0, react_icomoon_1.iconList)(is);
    return list.find(iconName => iconName.split(/[, ]+/).some(i => i === icon));
};
exports.searchIcon = searchIcon;
//# sourceMappingURL=icons.js.map