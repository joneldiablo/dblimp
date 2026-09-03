import Component, { ComponentProps } from "./component";
/**
 * Map of media component constructors indexed by their public name.
 *
 * @example
 * ```tsx
 * import MEDIA_COMPONENTS from "@farm-js/react-goat/media";
 * const Icon = MEDIA_COMPONENTS.Icons;
 * ```
 */
export type MediaComponents = Record<string, typeof Component | React.FC<ComponentProps> | any>;
/**
 * Collection of built-in media components shipped with the library.
 */
declare const MEDIA_COMPONENTS: MediaComponents;
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
export declare const addMediaComponents: (mediaComponents: MediaComponents) => void;
/**
 * Default export exposing all registered media components.
 *
 * @example
 * ```tsx
 * import MEDIA_COMPONENTS from "@farm-js/react-goat/media";
 * const SvgComp = MEDIA_COMPONENTS.Svg;
 * ```
 */
export default MEDIA_COMPONENTS;
//# sourceMappingURL=media.d.ts.map