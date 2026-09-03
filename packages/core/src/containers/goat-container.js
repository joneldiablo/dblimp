"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const event_handler_1 = __importDefault(require("dbl-utils/event-handler"));
const object_mutation_1 = require("dbl-utils/object-mutation");
const resolve_refs_1 = __importDefault(require("dbl-utils/resolve-refs"));
const goat_1 = __importDefault(require("../goat"));
const container_1 = __importDefault(require("./container"));
/**
 * Container capable of rendering a JSON schema using {@link Goat}.
 */
class GoatContainer extends container_1.default {
    constructor(props) {
        super(props);
        this.events = [];
        this.state = this.state;
        this.tag = "div";
        Object.assign(this.state, {});
        this.goat = new goat_1.default(this.fixedProps, this.mutations.bind(this));
    }
    get fixedProps() {
        return this.props;
    }
    get childrenIn() {
        var _a;
        return (_a = this.props.childrenIn) !== null && _a !== void 0 ? _a : false;
    }
    get theView() {
        var _a;
        return (_a = this.constructor.template) === null || _a === void 0 ? void 0 : _a.view;
    }
    get theTemplate() {
        return this.constructor.template || {};
    }
    componentDidMount() {
        super.componentDidMount();
        this.events.forEach(([evtName, callback]) => event_handler_1.default.subscribe(evtName, callback, this.name));
        this.evalTemplate();
    }
    /**
     * Resolves the template with provided definitions and view overrides.
     */
    evalTemplate() {
        var _a;
        const definitions = (0, object_mutation_1.deepMerge)(((_a = this.theTemplate) === null || _a === void 0 ? void 0 : _a.definitions) || {}, this.props.definitions || {});
        this.templateSolved = this.props.view
            ? (0, resolve_refs_1.default)(this.props.view, {
                template: this.theView,
                definitions,
                props: this.props,
                state: this.state,
            })
            : (0, resolve_refs_1.default)(this.theView, {
                definitions,
                props: this.props,
                state: this.state,
            });
    }
    componentWillUnmount() {
        super.componentWillUnmount();
        this.events.forEach(([eName]) => event_handler_1.default.unsubscribe(eName, this.name));
    }
    mutations(sectionName, section) {
        return this.state[sectionName];
    }
    /**
     * Builds content using {@link Goat} and optionally renders children inside.
     */
    content(children = this.props.children) {
        if (!(this.breakpoint && this.templateSolved))
            return this.waitBreakpoint;
        const builded = this.goat.buildContent(this.templateSolved);
        return !this.childrenIn ? (react_1.default.createElement(react_1.default.Fragment, null,
            builded,
            children)) : (builded);
    }
}
GoatContainer.jsClass = "GoatContainer";
GoatContainer.template = {
    view: {},
    definitions: {},
};
GoatContainer.defaultProps = {
    ...container_1.default.defaultProps,
    fullWidth: true,
    view: null,
    childrenIn: false,
    definitions: {},
};
exports.default = GoatContainer;
//# sourceMappingURL=goat-container.js.map