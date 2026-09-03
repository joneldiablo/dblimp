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
export default function useEventHandler(events: [string, (...args: any[]) => void][], id: string): void;
//# sourceMappingURL=use-event-handler.d.ts.map