import React from "react";
declare let is: any;
export interface IconsProps {
    className?: string | string[];
    classes?: string | string[];
    height?: number | string;
    icon?: string | null;
    inline?: boolean;
    size?: number | string;
    style?: React.CSSProperties;
    title?: string;
    width?: number | string;
}
export default class Icons extends React.Component<IconsProps> {
    static jsClass: string;
    static defaultProps: Partial<IconsProps>;
    render(): React.JSX.Element;
}
export declare const setIconSet: (isIn: typeof is) => void;
export declare const addIcons: (newSet: {
    icons: any[];
}) => void;
export declare const searchIcon: (icon?: string | null) => string | undefined;
export {};
//# sourceMappingURL=icons.d.ts.map