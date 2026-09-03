import React from "react";
export interface SvgProps extends React.SVGProps<SVGSVGElement> {
    classes?: string | string[];
    href?: string;
    inline?: boolean;
}
export default class Svg extends React.Component<SvgProps> {
    static jsClass: string;
    static defaultProps: Partial<SvgProps>;
    render(): React.JSX.Element;
}
//# sourceMappingURL=svg.d.ts.map