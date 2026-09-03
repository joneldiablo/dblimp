"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addMediaComponents = void 0;
const components_1 = require("./components");
const image_1 = __importDefault(require("./media/image"));
const svg_1 = __importDefault(require("./media/svg"));
const svg_imports_1 = __importDefault(require("./media/svg-imports"));
const video_1 = __importDefault(require("./media/video"));
/**
 * Collection of built-in media components shipped with the library.
 */
const MEDIA_COMPONENTS = {
    Image: image_1.default,
    Svg: svg_1.default,
    SvgImports: svg_imports_1.default,
    Video: video_1.default,
};
/**
 * Registers additional media components.
 *
 * @example
 * ```tsx
 * import { addMediaComponents } from "@farm-js/react-goat/media";
 * const Audio = () => <div />;
 * addMediaComponents({ Audio });
 * ```
 *
 * @param mediaComponents - Components to merge into the registry.
 */
const addMediaComponents = (mediaComponents) => {
    Object.assign(MEDIA_COMPONENTS, mediaComponents);
    (0, components_1.addComponents)(mediaComponents);
};
exports.addMediaComponents = addMediaComponents;
/**
 * Default export exposing all registered media components.
 *
 * @example
 * ```tsx
 * import MEDIA_COMPONENTS from "@farm-js/react-goat/media";
 * const SvgComp = MEDIA_COMPONENTS.Svg;
 * ```
 */
exports.default = MEDIA_COMPONENTS;
//# sourceMappingURL=media.js.map