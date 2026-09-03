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
exports.addWrapperExclusions = addWrapperExclusions;
const react_1 = __importDefault(require("react"));
const react_router_dom_1 = require("react-router-dom");
const html_react_parser_1 = __importStar(require("html-react-parser"));
const object_mutation_1 = require("dbl-utils/object-mutation");
const i18n_1 = __importDefault(require("dbl-utils/i18n"));
const format_value_1 = __importDefault(require("dbl-utils/format-value"));
const utils_1 = require("dbl-utils/utils");
const components_1 = __importDefault(require("./components"));
/** Components that should not be wrapped in a `<section>` by default. */
const excludeSectionWrapper = [
    "NavLink", "Image", "Link", "Icons", "SvgImports", "Action",
    "DropdownButtonContainer", "ModalButtonContainer", "DropdownItem",
];
/**
 * Adds component names to the wrapper exclusion list.
 *
 * @example
 * ```ts
 * addWrapperExclusions(["CustomComponent"]);
 * ```
 */
function addWrapperExclusions(exclusion) {
    excludeSectionWrapper.push(...[exclusion].flat());
}
/**
 * Utility class used to generate React content from a JSON structure.
 *
 * @example
 * ```tsx
 * const goat = new Goat({ name: "root" });
 * goat.buildContent({ name: "greeting", component: "Component", content: "Hi" });
 * ```
 */
class Goat {
    constructor(props, mutations) {
        this.parseOpts = {
            replace: (domNode) => {
                let C7tReplace;
                switch (domNode.name) {
                    case "navlink":
                        C7tReplace = react_router_dom_1.NavLink;
                        break;
                    case "a":
                        if (!domNode.attribs.to && domNode.attribs.href)
                            return;
                        C7tReplace = react_router_dom_1.Link;
                        break;
                    case "icons":
                        C7tReplace = components_1.default["Icons"];
                        if (!C7tReplace)
                            return;
                        domNode.attribs.inline = domNode.attribs.inline === "false" ? false : true;
                        break;
                    case "textarea":
                    case "input":
                        domNode.defaultValue = domNode.value;
                        domNode.defaultChecked = domNode.checked;
                        delete domNode.value;
                        delete domNode.checked;
                        return;
                    default:
                        return;
                }
                Object.keys(domNode).forEach(k => {
                    if (k.match(/^on[A-Z]/)) {
                        domNode[k] = this.props[k];
                    }
                });
                return react_1.default.createElement(C7tReplace, { ...(0, html_react_parser_1.attributesToProps)(domNode.attribs) }, (0, html_react_parser_1.domToReact)(domNode.children, this.parseOpts));
            }
        };
        this.actualSections = [];
        this.props = props;
        this.mutations = mutations;
        this.sections = this.sections.bind(this);
        this.buildContent = this.buildContent.bind(this);
    }
    /**
     * Builds React content from a JSON-like structure.
     *
     * @param content - Section definition or primitive value.
     * @param index - Optional index used as a React key fallback.
     */
    buildContent(content, index) {
        if (!content)
            return false;
        if (typeof content !== 'object') {
            const translate = (0, i18n_1.default)(content, this.props.context);
            const section = this.actualSections[this.actualSections.length - 1];
            if (typeof translate === 'number' || typeof translate === 'boolean') {
                return (0, format_value_1.default)(translate, section);
            }
            else if (typeof translate === 'string') {
                let parsed = (0, html_react_parser_1.default)(translate, this.parseOpts);
                if (typeof parsed === 'string')
                    parsed = (0, format_value_1.default)(parsed, section);
                return react_1.default.createElement(react_1.default.Fragment, { key: (0, utils_1.hash)(translate) }, parsed);
            }
        }
        else if (react_1.default.isValidElement(content)) {
            try {
                const untyped = content;
                content.key = content.key || untyped.props.name || index;
            }
            catch (error) {
            }
            return content;
        }
        else if (Array.isArray(content))
            return content.map(this.buildContent);
        if (Array.isArray(content.name))
            content.name = content.name.join('-');
        if (typeof content === 'object' && typeof content.name !== 'string')
            return Object.keys(content)
                .map((name, i) => this.buildContent(typeof content[name] !== 'object'
                ? content[name] : { name, ...content[name] }, i));
        this.actualSections.push(content);
        const builded = this.sections(content, index);
        this.actualSections.pop();
        return builded;
    }
    /**
     * Renders a single section definition.
     *
     * @param sr - Section record to render.
     * @param i - Optional index used as key.
     */
    sections(sr, i) {
        const m = (typeof this.mutations === 'function' && this.mutations(sr.name, sr)) || {};
        if (m.style && sr.style)
            m.style = (0, object_mutation_1.deepMerge)({}, sr.style, m.style);
        if (m._props && sr._props)
            m._props = (0, object_mutation_1.deepMerge)({}, sr._props, m._props);
        const sectionRaw = Object.assign({}, sr, m || {});
        if (sectionRaw.active === false)
            return false;
        const { component: componentName, content, placeholder, label, message, errorMessage, managerName, wrapperClasses, wrapperStyle = {}, ...section } = sectionRaw;
        const { navigate, location, match, childrenIn = this.childrenIn, children } = this.props;
        const Component = components_1.default[componentName] || (components_1.default.Component);
        const extraBuilded = [Component.slots].flat().filter(Boolean).reduce((eb, key) => {
            const tmp = section[key];
            section[key] = null;
            delete section[key];
            eb[key] = this.buildContent(tmp);
            return eb;
        }, {});
        const componentProps = {
            ...section,
            managerName: managerName || this.props.name,
            label: this.buildContent(label),
            placeholder: this.buildContent(placeholder),
            message: this.buildContent(message),
            errorMessage: this.buildContent(errorMessage),
            ...extraBuilded,
            location,
            match,
            navigate
        };
        if (Component.dontBuildContent)
            componentProps.content = content;
        const childrenHere = ((Array.isArray(childrenIn) ? childrenIn.join('-') : childrenIn)
            === (Array.isArray(section.name) ? section.name.join('-') : section.name));
        if (!Component.dontBuildContent && content && childrenHere) {
            componentProps.children = react_1.default.createElement(react_1.default.Fragment, null,
                this.buildContent(content),
                children);
        }
        else if (!Component.dontBuildContent && content) {
            componentProps.children = this.buildContent(content);
        }
        else if (childrenHere) {
            componentProps.children = children;
        }
        const cnSection = [componentProps.name + '-section'];
        if (this.props.test)
            cnSection.push('test-section-wrapper');
        if (this.props.wrapperClasses)
            cnSection.push(this.props.wrapperClasses);
        if (wrapperClasses)
            cnSection.push(wrapperClasses);
        const exclusionSec = excludeSectionWrapper.includes(componentName);
        const Wrapper = (componentProps.wrapper === false || Component.wrapper === false)
            ? false : componentProps.wrapper || Component.wrapper || 'section';
        if (!Wrapper || exclusionSec || componentProps.tag) {
            if (this.props.test) {
                if (!componentProps.style)
                    componentProps.style = {};
                componentProps.style.border = '1px solid yellow';
            }
            return react_1.default.createElement(Component, { key: componentProps.name || i, ...componentProps });
        }
        const wrapperProps = {
            className: cnSection.flat().join(' '),
            style: {
                "--component-name": `"${componentProps.name}"`,
                ...wrapperStyle
            }
        };
        return (react_1.default.createElement(Wrapper, { key: componentProps.name || i, ...wrapperProps },
            react_1.default.createElement(Component, { ...componentProps })));
    }
}
exports.default = Goat;
//# sourceMappingURL=goat.js.map