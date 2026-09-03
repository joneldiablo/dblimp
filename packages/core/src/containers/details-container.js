"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const event_handler_1 = __importDefault(require("dbl-utils/event-handler"));
const utils_1 = require("dbl-utils/utils");
const component_1 = __importDefault(require("../component"));
class DetailsContainer extends component_1.default {
    constructor(props) {
        super(props);
        this.events = [];
        this.ref = react_1.default.createRef();
        this.onUpdate = ({ open }) => {
            if (typeof open === "boolean") {
                this.setState({ open });
            }
        };
        this.tag = "details";
        this.state = this.state;
        Object.assign(this.state, {
            open: !!props.open,
        });
        this.onToggle = this.onToggle.bind(this);
        this.events.push(["update." + props.name, this.onUpdate.bind(this)]);
        this.eventHandlers.onToggle = this.onToggle;
    }
    get componentProps() {
        return { open: this.state.open, ...this.props._props };
    }
    componentDidMount() {
        this.events.forEach(([evt, handler]) => event_handler_1.default.subscribe(evt, handler, this.props.name));
    }
    componentWillUnmount() {
        this.events.forEach(([evt]) => event_handler_1.default.unsubscribe(evt, this.props.name));
    }
    onToggle(evt) {
        const open = evt.target.open;
        this.setState({ open });
        event_handler_1.default.dispatch(this.props.name, {
            [this.props.name]: open ? "open" : "closed",
            id: this.props.id,
            data: this.props.data,
        });
    }
    content(children = this.props.children) {
        const { containerClasses, labelClasses } = this.props;
        const cnl = Array.isArray(labelClasses) ? labelClasses : [labelClasses];
        const cnc = Array.isArray(containerClasses)
            ? containerClasses
            : [containerClasses];
        return (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement("summary", { className: (0, utils_1.splitAndFlat)(cnl, " ").join(" ") }, this.props.label),
            this.state.open && (react_1.default.createElement("div", { className: (0, utils_1.splitAndFlat)(cnc, " ").join(" ") }, children))));
    }
}
DetailsContainer.jsClass = "DetailsContainer";
exports.default = DetailsContainer;
//# sourceMappingURL=details-container.js.map