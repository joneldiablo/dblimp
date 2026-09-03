"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const event_handler_1 = __importDefault(require("dbl-utils/event-handler"));
const object_mutation_1 = require("dbl-utils/object-mutation");
const resolve_refs_1 = __importDefault(require("dbl-utils/resolve-refs"));
const goat_1 = __importDefault(require("./goat"));
const component_1 = __importDefault(require("./component"));
class GoatComponent extends component_1.default {
    constructor(props) {
        super(props);
        this.events = [];
        this.tag = "div";
        Object.assign(this.state, {});
        this.goat = new goat_1.default(this.fixedProps, this.mutations.bind(this));
        this.evalTemplate();
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
        this.events.forEach(([evtName, callback]) => event_handler_1.default.subscribe(evtName, callback, this.name));
        this.evalTemplate();
    }
    evalTemplate() {
        var _a;
        const definitions = (0, object_mutation_1.deepMerge)(((_a = this.theTemplate) === null || _a === void 0 ? void 0 : _a.definitions) || {}, this.props.definitions || {});
        this.templateSolved = this.props.view
            ? (0, resolve_refs_1.default)(this.props.view, {
                template: this.theView,
                definitions,
                props: this.props,
                state: this.state
            })
            : (0, resolve_refs_1.default)(this.theView, {
                definitions,
                props: this.props,
                state: this.state
            });
    }
    componentWillUnmount() {
        this.events.forEach(([eName]) => event_handler_1.default.unsubscribe(eName, this.name));
    }
    mutations(sectionName, section) {
        return this.state[sectionName];
    }
    content(children = this.props.children) {
        if (!this.templateSolved)
            return null;
        const builded = this.goat.buildContent(this.templateSolved);
        return !this.childrenIn ? (react_1.default.createElement(react_1.default.Fragment, null,
            builded,
            children)) : (builded);
    }
}
GoatComponent.jsClass = "GoatComponent";
GoatComponent.template = {
    view: {},
    definitions: {}
};
GoatComponent.defaultProps = {
    ...component_1.default.defaultProps,
    view: null,
    childrenIn: false,
    definitions: {}
};
exports.default = GoatComponent;
//# sourceMappingURL=goat-component.js.map