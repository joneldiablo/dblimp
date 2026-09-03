import React from "react";
/**
 * Adds SVG components to the imported collection.
 * @param svgs - An object containing SVG components.
 */
export declare function addSvgs(svgs: Record<string, React.FC<any>>): void;
export interface SvgImportsProps {
    id?: string;
    name?: string;
    classes?: string | string[];
    className?: string;
    class?: string;
    svg?: string;
    style?: React.CSSProperties;
    title?: string;
}
declare const SvgImports: React.FC<SvgImportsProps>;
export default SvgImports;
//# sourceMappingURL=svg-imports.d.ts.map