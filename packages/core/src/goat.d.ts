import React from "react";
/**
 * Adds component names to the wrapper exclusion list.
 *
 * @example
 * ```ts
 * addWrapperExclusions(["CustomComponent"]);
 * ```
 */
export declare function addWrapperExclusions(exclusion: string | string[]): void;
/**
 * Utility class used to generate React content from a JSON structure.
 *
 * @example
 * ```tsx
 * const goat = new Goat({ name: "root" });
 * goat.buildContent({ name: "greeting", component: "Component", content: "Hi" });
 * ```
 */
export default class Goat {
    protected parseOpts: {
        replace: (domNode: any) => React.JSX.Element | undefined;
    };
    protected actualSections: any[];
    protected props: any;
    protected mutations?: Function;
    protected childrenIn: any;
    constructor(props: any, mutations?: Function);
    /**
     * Builds React content from a JSON-like structure.
     *
     * @param content - Section definition or primitive value.
     * @param index - Optional index used as a React key fallback.
     */
    buildContent(content: any, index?: number): React.ReactNode;
    /**
     * Renders a single section definition.
     *
     * @param sr - Section record to render.
     * @param i - Optional index used as key.
     */
    protected sections(sr: any, i?: number): React.ReactNode;
}
//# sourceMappingURL=goat.d.ts.map