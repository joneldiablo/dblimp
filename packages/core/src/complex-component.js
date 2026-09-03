"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.nameSuffixes = void 0;
const react_1 = __importDefault(require("react"));
const dbl_utils_1 = require("dbl-utils");
const goat_1 = __importDefault(require("./goat"));
const component_1 = __importDefault(require("./component"));
/**
 * Utility to create `$name*` helpers for schema definitions.
 */
const nameSuffixes = (sfxs = []) => {
    return sfxs.reduce((acum, item) => {
        acum[`$name${item}`] = ["join", ["$data/name", item], ""];
        return acum;
    }, {});
};
exports.nameSuffixes = nameSuffixes;
const schemaDefault = {
    view: { name: "$nameDummy", content: "Replace this" },
    definitions: {},
};
/**
 * Component capable of rendering a JSON schema using {@link Goat}.
 */
class ComplexComponent extends component_1.default {
    constructor(props) {
        super(props);
        this.events = [];
        this.goat = new goat_1.default(props, this.mutations.bind(this));
        Object.assign(this.state, {
            view: this.buildView(),
        });
    }
    componentDidMount() {
        this.events.forEach((e) => dbl_utils_1.eventHandler.subscribe(...e, this.name));
    }
    componentWillUnmount() {
        this.events.forEach(([eName]) => dbl_utils_1.eventHandler.unsubscribe(eName, this.name));
    }
    /**
     * Builds a resolved view based on the provided schema and rules.
     */
    buildView() {
        const { schema = schemaDefault, rules, definitions, ...all } = this.props;
        schema.data = all;
        Object.assign(schema.definitions, definitions);
        return (0, dbl_utils_1.resolveRefs)(schema.view, schema, rules);
    }
    mutations(sn, conf) {
        return this.state[sn];
    }
    /**
     * Renders the resolved schema and optionally appends children.
     */
    content(children = this.props.children) {
        const { childrenIn } = this.props;
        const content = this.goat.buildContent(this.state.view);
        return (react_1.default.createElement(react_1.default.Fragment, null,
            content,
            !childrenIn && children));
    }
}
ComplexComponent.jsClass = "Complex";
ComplexComponent.defaultProps = {
    ...component_1.default.defaultProps,
    schema: schemaDefault,
    definitions: {},
    classes: { ".": "" },
    rules: {},
};
exports.default = ComplexComponent;
//# sourceMappingURL=complex-component.js.map