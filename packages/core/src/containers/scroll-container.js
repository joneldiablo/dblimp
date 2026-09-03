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
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const dbl_utils_1 = require("dbl-utils");
const use_event_handler_1 = __importDefault(require("../hooks/use-event-handler"));
const container_1 = __importDefault(require("./container"));
let timeoutDispatchPosition;
function ScrollXNode({ name, scrollTrackClasses = [], scrollBarClasses = [], scrollTrackStyle = {}, scrollBarStyle = {}, breakpoint, orientation, width, height, children, }) {
    const scrollBarPosition = (0, react_1.useCallback)((percentagePosition) => {
        if (!(scrollTrackRef.current && scrollBarRef.current))
            return;
        const scrollBarrPercentage = percentagePosition *
            (scrollTrackRef.current.clientWidth - scrollBarRef.current.clientWidth);
        setScrollBarLeft(scrollBarrPercentage / scrollTrackRef.current.clientWidth);
    }, []);
    const containerPosition = (0, react_1.useCallback)((step) => {
        const newTranslate = Math.min(Math.max(initialTranslate.current + step, -diffContentWidth), 0);
        initialTranslate.current = newTranslate;
        const newPercentage = Math.abs(newTranslate / diffContentWidth);
        setPercentage(newPercentage);
        setTranslate(newTranslate);
        scrollBarPosition(newPercentage);
        clearTimeout(timeoutDispatchPosition);
        timeoutDispatchPosition = setTimeout(() => {
            dbl_utils_1.eventHandler.dispatch(name, {
                [name]: {
                    position: Math.abs(newTranslate),
                    percentage: newPercentage,
                    size: diffContentWidth,
                },
            });
        }, 660);
    }, []);
    const updateScroll = (0, react_1.useCallback)((update) => {
        if (update.position !== undefined) {
            initialTranslate.current = 0;
            containerPosition(update.position);
        }
        if (update.percentage !== undefined) {
            initialTranslate.current = 0;
            const position = -update.percentage * diffContentWidth;
            containerPosition(position);
        }
        if (update.resize) {
            const container = containerRef.current;
            const newContentWidth = container.scrollWidth;
            const newDiffContentWidth = container.scrollWidth - container.clientWidth;
            setContentWidth(newContentWidth);
            setDiffContentWidth(newDiffContentWidth);
            initialTranslate.current = 0;
            const position = -percentage * newDiffContentWidth;
            containerPosition(position);
        }
    }, []);
    const handleScroll = (0, react_1.useCallback)(() => {
        if (!scrollTrackRef.current)
            return;
        const container = containerRef.current;
        const scrollLeft = container.scrollLeft;
        const scrollBarPosition = (scrollLeft / diffContentWidth) *
            (scrollTrackRef.current.clientWidth - scrollBarRef.current.clientWidth);
        setScrollBarLeft(scrollBarPosition / scrollTrackRef.current.clientWidth);
    }, []);
    const handleWheel = (0, react_1.useCallback)((event) => {
        let speed = event.deltaX;
        if (speed === 0 && event.shiftKey) {
            event.preventDefault();
            speed = -event.deltaY / Math.abs(event.deltaY);
        }
        speed *= 10;
        const container = containerRef.current;
        if (!container)
            return;
        const containerRatio = container.scrollWidth / container.clientWidth;
        containerPosition(speed * containerRatio);
    }, [containerPosition]);
    const handleDrag = (0, react_1.useCallback)((e) => {
        e.preventDefault();
        e.stopPropagation();
        const posValue = e.clientX || e.touches
            ? e.touches[0].clientX
            : 0;
        const initialValue = initialMouseX.current;
        if (!containerRef.current || posValue === 0)
            return;
        if (Math.abs(posValue - initialValue) < 40)
            return;
        const barPercent = scrollBarRef.current.clientWidth / scrollTrackRef.current.clientWidth;
        const deltaX = (posValue - initialValue) * barPercent;
        containerPosition(-deltaX);
    }, [containerPosition]);
    const handleDragEnd = (0, react_1.useCallback)((e) => {
        e.preventDefault();
        e.stopPropagation();
        containerRef.current.addEventListener("scroll", handleScroll);
        document.removeEventListener("mousemove", handleDrag);
        document.removeEventListener("touchmove", handleDrag);
        document.removeEventListener("mouseup", handleDragEnd);
        document.removeEventListener("touchend", handleDragEnd);
        initialMouseX.current = 0;
        initialScrollLeft.current = 0;
    }, [handleScroll, handleDrag]);
    const handleDragStart = (0, react_1.useCallback)((e) => {
        e.preventDefault();
        e.stopPropagation();
        const initialPosValue = e.clientX || e.touches
            ? e.touches[0].clientX
            : 0;
        containerRef.current.removeEventListener("scroll", handleScroll);
        document.addEventListener("mousemove", handleDrag);
        document.addEventListener("touchmove", handleDrag);
        document.addEventListener("mouseup", handleDragEnd);
        document.addEventListener("touchend", handleDragEnd);
        initialMouseX.current = initialPosValue;
        initialScrollLeft.current = scrollBarLeft;
    }, [handleDrag, handleDragEnd, handleScroll]);
    const handleTouchStart = (0, react_1.useCallback)((e) => {
        initialTouchX.current = e.touches[0].clientX;
        setIsTouching(true);
    }, []);
    const handleTouchMove = (0, react_1.useCallback)((event) => {
        const vector = event.touches[0].clientX - initialTouchX.current;
        initialTouchX.current = event.touches[0].clientX;
        containerPosition(vector);
    }, [containerPosition]);
    const handleTouchEnd = (0, react_1.useCallback)(() => {
        setIsTouching(false);
    }, []);
    const containerRef = (0, react_1.useRef)(null);
    const scrollTrackRef = (0, react_1.useRef)(null);
    const scrollBarRef = (0, react_1.useRef)(null);
    const initialMouseX = (0, react_1.useRef)(0);
    const initialScrollLeft = (0, react_1.useRef)(0);
    const initialTouchX = (0, react_1.useRef)(0);
    const initialTranslate = (0, react_1.useRef)(0);
    const [isTouchDevice, setIsTouchDevice] = (0, react_1.useState)(false);
    const [isTouching, setIsTouching] = (0, react_1.useState)(false);
    const [scrollBarLeft, setScrollBarLeft] = (0, react_1.useState)(0);
    const [wScrollBar, setWScrollBar] = (0, react_1.useState)(0);
    const [showBar, setShowBar] = (0, react_1.useState)(false);
    const [contentWidth, setContentWidth] = (0, react_1.useState)(0);
    const [diffContentWidth, setDiffContentWidth] = (0, react_1.useState)(0);
    const [translate, setTranslate] = (0, react_1.useState)(initialTranslate.current);
    const [percentage, setPercentage] = (0, react_1.useState)(initialTranslate.current);
    (0, use_event_handler_1.default)([[`update.${name}`, updateScroll]], [name, ScrollContainer.jsClass].join("-"));
    (0, react_1.useLayoutEffect)(() => {
        setIsTouchDevice("ontouchstart" in window);
        setScrollBarLeft(0);
        setTranslate(0);
    }, []);
    (0, react_1.useEffect)(() => {
        if (containerRef.current) {
            const container = containerRef.current;
            const contentWidth = container.scrollWidth;
            const containerWidth = container.clientWidth;
            const diffContentWidth = container.scrollWidth - container.clientWidth;
            const isContentOverflowing = contentWidth > containerWidth;
            setShowBar(isContentOverflowing && (!isTouchDevice || isTouching));
            setContentWidth(contentWidth);
            setDiffContentWidth(diffContentWidth);
            const wp = (containerWidth / contentWidth) * 100;
            setWScrollBar(Math.max(Math.min(wp, 90), 20));
            dbl_utils_1.eventHandler.dispatch(name, {
                [name]: {
                    position: Math.abs(initialTranslate.current),
                    percentage: Math.abs(initialTranslate.current / diffContentWidth),
                    size: diffContentWidth,
                },
            });
        }
    }, [
        contentWidth,
        breakpoint,
        orientation,
        width,
        height,
        isTouchDevice,
        isTouching,
    ]);
    (0, react_1.useEffect)(() => {
        const container = containerRef.current;
        container.addEventListener("wheel", handleWheel, { passive: false });
        container.addEventListener("touchstart", handleTouchStart);
        container.addEventListener("touchmove", handleTouchMove);
        container.addEventListener("touchend", handleTouchEnd);
        return () => {
            container.removeEventListener("wheel", handleWheel);
            container.removeEventListener("touchstart", handleTouchStart);
            container.removeEventListener("touchmove", handleTouchMove);
            container.removeEventListener("touchend", handleTouchEnd);
        };
    }, [contentWidth, handleTouchEnd, handleTouchMove, handleTouchStart]);
    (0, react_1.useEffect)(() => {
        const container = containerRef.current;
        container.addEventListener("scroll", handleScroll);
        return () => container.removeEventListener("scroll", handleScroll);
    }, [wScrollBar, contentWidth]);
    const stc = [scrollTrackClasses];
    const sbc = [
        "cursor-pointer",
        scrollBarClasses,
    ];
    const fc = (input) => (0, dbl_utils_1.splitAndFlat)([input], " ").join(" ");
    const styleSbc = {
        height: "100%",
        backgroundColor: "#888",
        ...scrollBarStyle,
        width: `${wScrollBar}%`,
        marginLeft: `${scrollBarLeft * 100}%`,
    };
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement("div", { style: {
                overflowX: "clip",
            } },
            react_1.default.createElement("div", { ref: containerRef, id: `${name}-container`, style: {
                    paddingBottom: "2rem",
                    marginBottom: "-2rem",
                    transform: `translate(${translate}px)`,
                    "--dbl-scroll-x-position": `${Math.abs(translate)}px`,
                } }, children)),
        showBar && (react_1.default.createElement("div", { className: fc(stc), ref: scrollTrackRef, style: {
                bottom: 0,
                left: 0,
                right: 0,
                height: "20px",
                backgroundColor: "#ccc",
                ...scrollTrackStyle,
                position: "sticky",
            } },
            react_1.default.createElement("div", { ref: scrollBarRef, className: fc(sbc), style: styleSbc, onMouseDown: (e) => handleDragStart(e), onTouchStart: (e) => handleDragStart(e), role: "scrollbar", "aria-controls": `${name}-container`, "aria-valuemin": 0, "aria-valuemax": 100, "aria-valuenow": percentage * 100, tabIndex: 0 })))));
}
class ScrollContainer extends container_1.default {
    content(children = this.props.children) {
        const { name, scrollTrackClasses, scrollBarClasses, scrollTrackStyle, scrollBarStyle, } = this.props;
        return (react_1.default.createElement(ScrollXNode, { name,
            breakpoint: this.breakpoint,
            orientation: this.orientation,
            width: this.width,
            height: this.height,
            scrollTrackClasses,
            scrollBarClasses,
            scrollTrackStyle,
            scrollBarStyle,
            children }));
    }
}
ScrollContainer.jsClass = "ScrollContainer";
exports.default = ScrollContainer;
//# sourceMappingURL=scroll-container.js.map