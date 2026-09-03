import React from "react";
import Component, { ComponentProps, ComponentState } from "../component";
export interface VideoProps extends ComponentProps {
    autoPlay?: boolean;
    controls?: boolean;
    height?: number | string;
    loop?: boolean;
    muted?: boolean;
    playsInline?: boolean;
    poster?: string;
    preload?: "none" | "metadata" | "auto" | true;
    src?: string;
    width?: number | string;
    sources?: {
        src: string;
        type?: string;
    }[] | {
        src: string;
        type?: string;
    };
}
export interface VideoState extends ComponentState {
}
export default class Video<TProps extends VideoProps = VideoProps, TState extends VideoState = VideoState> extends Component<TProps, TState> {
    static jsClass: string;
    protected tag: keyof React.JSX.IntrinsicElements;
    protected get componentProps(): Record<string, any>;
    protected content(children?: React.ReactNode): React.ReactNode;
}
//# sourceMappingURL=video.d.ts.map