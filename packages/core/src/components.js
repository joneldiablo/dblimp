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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addComponents = void 0;
const component_1 = __importDefault(require("./component"));
const goat_component_1 = __importDefault(require("./goat-component"));
const containers_1 = __importDefault(require("./containers"));
const fields_1 = __importDefault(require("./fields"));
const media_1 = __importDefault(require("./media"));
const navigation_1 = __importDefault(require("./navigation"));
const route_1 = __importDefault(require("./react-router-schema/route"));
__exportStar(require("./component"), exports);
__exportStar(require("./goat-component"), exports);
__exportStar(require("./containers"), exports);
__exportStar(require("./fields"), exports);
__exportStar(require("./media"), exports);
__exportStar(require("./navigation"), exports);
__exportStar(require("./react-router-schema/route"), exports);
/**
 * Registry of available React components used by `Goat`.
 */
const COMPONENTS = {
    Component: component_1.default,
    GoatComponent: goat_component_1.default,
    ...containers_1.default,
    ...fields_1.default,
    ...media_1.default,
    ...navigation_1.default,
    Route: route_1.default,
};
/**
 * Extends the components registry with custom components.
 *
 * @example
 * ```ts
 * addComponents({ Custom: MyComponent });
 * ```
 */
const addComponents = (components) => {
    if (!components)
        return false;
    Object.assign(COMPONENTS, components);
    return true;
};
exports.addComponents = addComponents;
exports.default = COMPONENTS;
//# sourceMappingURL=components.js.map