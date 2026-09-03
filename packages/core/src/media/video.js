"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const component_1 = __importDefault(require("../component"));
class Video extends component_1.default {
    constructor() {
        super(...arguments);
        this.tag = "video";
    }
    get componentProps() {
        const { autoPlay, controls, height, loop, muted, playsInline, poster, preload, src, width, } = this.props;
        return {
            autoPlay,
            controls,
            height,
            loop,
            muted,
            playsInline,
            poster,
            preload,
            src,
            width,
            ...this.props._props,
        };
    }
    content(children = this.props.children) {
        if (this.props.src)
            return false;
        const sources = Array.isArray(this.props.sources)
            ? this.props.sources
            : [this.props.sources];
        return sources.map((s, i) => s ? react_1.default.createElement("source", { key: i, src: s.src, type: s.type }) : null);
    }
}
Video.jsClass = "Video";
exports.default = Video;
//# sourceMappingURL=video.js.map