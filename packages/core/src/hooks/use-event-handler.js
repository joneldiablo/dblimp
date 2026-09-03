"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = useEventHandler;
const react_1 = require("react");
const event_handler_1 = __importDefault(require("dbl-utils/event-handler"));
/**
 * React hook to subscribe to and clean up event-handler subscriptions.
 *
 * @param events - Array of tuples containing event name and callback.
 * @param id - Identifier used for subscription grouping.
 *
 * @example
 * ```tsx
 * useEventHandler([["ready.button", () => console.log("ready")]], "btn1");
 * ```
 */
function useEventHandler(events, id) {
    const eventNames = Object.values(events).map(([name]) => name).join(".");
    (0, react_1.useEffect)(() => {
        Object.values(events).forEach(([evtName, evtCallback]) => {
            event_handler_1.default.subscribe(evtName, evtCallback, id);
        });
        return () => {
            Object.values(events).forEach(([evtName]) => {
                event_handler_1.default.unsubscribe(evtName, id);
            });
        };
    }, [eventNames, id]);
}
//# sourceMappingURL=use-event-handler.js.map