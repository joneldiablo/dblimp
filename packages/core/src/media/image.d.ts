import React from "react";
import Component, { ComponentProps } from "../component";
type ObjectFit = 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
export interface ImageProps extends ComponentProps {
    src?: string | Record<string, string>;
    alt?: string;
    width?: number | string;
    height?: number | string;
    objectFit?: ObjectFit;
    objectPosition?: string;
    imageClasses?: string | string[];
    contentProps?: Record<string, any>;
}
export default class Image extends Component<ImageProps> {
    static jsClass: string;
    static defaultProps: Partial<ImageProps>;
    protected tag: keyof React.JSX.IntrinsicElements;
    protected classes: string;
    protected content(): React.ReactNode;
}
export {};
//# sourceMappingURL=image.d.ts.map