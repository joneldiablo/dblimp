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
const react_1 = __importStar(require("react"));
const event_handler_1 = __importDefault(require("dbl-utils/event-handler"));
class Component extends react_1.default.Component {
    constructor(props) {
        super(props);
        this.tag = "div";
        this.classes = "";
        this.style = {};
        this.ref = (0, react_1.createRef)();
        this.name = `${this.props.name}-${this.constructor.jsClass}`;
        this.state = {
            localClasses: "",
            localStyles: {},
        };
        this.onEvent = this.onEvent.bind(this);
        this.eventHandlers = {
            onClick: this.onEvent,
            onChange: this.onEvent,
            onMouseOver: this.onEvent,
            onMouseOut: this.onEvent,
            onMouseEnter: this.onEvent,
            onMouseLeave: this.onEvent,
            onKeyDown: this.onEvent,
            onLoad: this.onEvent,
        };
    }
    setClasses(classes) {
        const localClasses = new Set(this.state.localClasses.split(" ").filter(Boolean));
        if (!classes)
            return [localClasses, new Set()];
        const setClasses = new Set(Array.isArray(classes)
            ? classes.flatMap((c) => c.split(" "))
            : classes.split(" "));
        return [localClasses, setClasses];
    }
    toggleClasses(classes) {
        if (!classes)
            return false;
        const [localClasses, setClasses] = this.setClasses(classes);
        setClasses.forEach((c) => {
            if (localClasses.has(c))
                localClasses.delete(c);
            else
                localClasses.add(c);
        });
        this.setState({
            localClasses: Array.from(localClasses).filter(Boolean).join(" "),
        });
        return true;
    }
    addClasses(classes) {
        if (!classes)
            return false;
        const [localClasses, setClasses] = this.setClasses(classes);
        setClasses.forEach((c) => localClasses.add(c));
        this.setState({
            localClasses: Array.from(localClasses).filter(Boolean).join(" "),
        });
        return true;
    }
    deleteClasses(classes) {
        if (!classes)
            return false;
        const [localClasses, setClasses] = this.setClasses(classes);
        setClasses.forEach((c) => localClasses.delete(c));
        this.setState({
            localClasses: Array.from(localClasses).filter(Boolean).join(" "),
        });
        return true;
    }
    get componentProps() {
        return this.props._props;
    }
    content(children = this.props.children) {
        return children;
    }
    onEvent(e) {
        event_handler_1.default.dispatch(`${e.type}.${this.props.name}`, {
            [this.props.name]: {
                state: this.state,
                value: e.target.value,
            },
        });
    }
    render() {
        const { classes, style, name, tag, active } = this.props;
        const { localClasses, localStyles } = this.state;
        if (!this.ready) {
            this.ready = setTimeout(() => event_handler_1.default.dispatch(`ready.${name}`), 50);
        }
        const content = this.content();
        const Tag = tag === undefined ? this.tag : tag;
        if (Tag === false)
            return react_1.default.createElement(react_1.default.Fragment, null,
                content,
                " ");
        const TheTag = Tag;
        const cn = [
            this.constructor.jsClass,
            name,
            this.name,
            this.classes,
            localClasses,
        ];
        if (classes) {
            if (typeof classes === "string")
                cn.push(classes);
            else if (Array.isArray(classes))
                cn.push(classes.join(" "));
            else
                cn.push(classes["."]);
        }
        const s = { ...this.style, ...localStyles, ...style };
        const props = Tag === react_1.default.Fragment
            ? {}
            : {
                className: cn.filter(Boolean).join(" "),
                style: s,
                ref: this.ref,
                ...this.eventHandlers,
                ...this.componentProps,
            };
        return active ? react_1.default.createElement(TheTag, { ...props },
            " ",
            content) : react_1.default.createElement(react_1.default.Fragment, null);
    }
}
Component.jsClass = "Component";
Component.defaultProps = {
    classes: "",
    style: {},
    active: true,
};
exports.default = Component;
//# sourceMappingURL=component.js.map