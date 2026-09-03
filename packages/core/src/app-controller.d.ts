import React from "react";
import Controller from "./controllers/controller";
import { RouteProps } from "./react-router-schema/route";
export interface RequestAppGoat extends RequestInit {
    query?: Record<string, any>;
    format?: 'raw' | 'json' | 'text' | 'blob' | 'arrayBuffer' | 'formData';
    timeout?: number;
    body?: any;
}
/**
 * Constructor properties for `AppGoatController`.
 */
export interface AppGoatControllerProps {
    icons?: {
        icons: any[];
    } | false;
    controllers?: Record<string, typeof Controller<any, any>>;
    components?: Record<string, Record<string, React.FC<any> | typeof React.Component<any, any>>>;
    definitions?: Array<any> | Record<string, any>;
    routes?: Array<RouteSchema>;
    schema?: RouteSchema;
    api?: string;
    apiHeaders?: Record<string, string> | string;
    fetchBefore?: (url: string, options: RequestAppGoat) => RequestAppGoat;
    fetchAfter?: (res: any) => any;
    fetchError?: (error: any, url: string) => any;
    maxTimeout?: number;
    minTimeout?: number;
    dictionary?: Record<string, any>;
    formatDate?: Record<string, any>;
    formatNumber?: Record<string, any>;
    formatTime?: Record<string, any>;
    formatDateTime?: Record<string, any>;
    lang?: string;
    initialState?: Record<string, any>;
    fields?: Record<string, any>;
}
export interface RouteSchema {
    view: Record<string, any>;
    definitions?: Record<string, any>;
    routes?: Record<string, RouteSchema> | RouteSchema[] | Array<RouteSchema | string>;
    data?: any;
}
export declare class AppGoatAbortController extends AbortController {
    timeoutId?: NodeJS.Timeout;
}
export declare class AppGoatError extends Error {
    error?: boolean;
}
/**
 * Main controller that manages application configuration and global state.
 *
 * @example
 * ```ts
 * const app = new AppGoatController();
 * app.set("token", "123");
 * ```
 */
export declare class AppGoatController {
    fetchList: Record<string, AppGoatAbortController>;
    globalDefinitions: Array<any>;
    routes: Record<string, any>;
    tmpRoutesFound: number;
    rootSchema?: RouteProps;
    random: string;
    props?: AppGoatControllerProps;
    prefixStorage: string;
    update?: (key: string) => void;
    constructor(props?: AppGoatControllerProps);
    /**
     * Initializes the AppGoatController configuration.
     *
     * @param props - Initial properties to configure the application.
     */
    init(props?: AppGoatControllerProps): void;
    /**
     * Recursively processes a route schema to build a navigable structure.
     *
     * @param schema - Route schema to process.
     * @returns The processed view schema with nested routes resolved.
     */
    findingRoutesRecursive(schema: RouteSchema): RouteProps;
    /**
     * Builds the root schema from the initial schema, resolving all nested routes.
     *
     * @param schema - Initial schema to start from.
     * @returns Fully processed root schema.
     */
    buildRootSchema(schema: RouteSchema): RouteProps;
    /**
     * Converts a JavaScript object to a JSON string.
     * Encryption is not implemented yet.
     *
     * @param data - Object to stringify.
     * @param encrypt - Whether to encrypt the string (pending).
     */
    stringify(data: any, encrypt?: boolean): string;
    /**
     * Parses a JSON string back to an object.
     * Decryption is not implemented yet.
     *
     * @param data - JSON string to parse.
     */
    parse(data: string): any;
    /**
     * Saves a value in the global storage and optionally in localStorage/sessionStorage.
     *
     * @param key - Key used to identify the stored value.
     * @param data - Value to store.
     * @param options - Storage options.
     */
    set(key: string, data: any, { dispatch, storage, encrypt }?: {
        dispatch?: boolean;
        storage?: 'local' | 'session' | null;
        encrypt?: boolean;
    }): void;
    /**
     * Retrieves a value from global or browser storage.
     *
     * @param key - Key of the desired value.
     * @returns Stored value or undefined.
     */
    get(key: string): any;
    /**
     * Removes a value from global and optional browser storage.
     *
     * @param key - Key of the value to remove.
     * @param options - Removal options.
     */
    remove(key: string, { storage, dispatch }?: {
        storage?: 'local' | 'session' | null;
        dispatch?: boolean;
    }): void;
    /**
     * Retrieves all global definitions combined with the root schema definitions.
     *
     * @returns Fully resolved definitions object.
     */
    getRootDefinitions(): Record<string, any>;
    /**
     * Gets combined and resolved definitions for a view by name.
     *
     * @param name - View name to retrieve definitions for.
     * @returns Resolved view definitions or an empty object.
     */
    getViewDefinitions(name: string): Record<string, any>;
    /**
     * Returns all current global definitions.
     *
     * @returns Array of global definitions.
     */
    getGlobalDefinitions(): Array<any>;
    /**
     * Returns the keys currently stored in global state.
     *
     * @returns Array of global state keys.
     */
    getGlobalKeys(): string[];
    /**
     * Executes a promise ensuring a minimum wait time.
     *
     * @param promise - Promise to execute.
     * @param timeout - Minimum time in milliseconds before resolving.
     * @returns Result of the original promise after waiting.
     */
    minTimeout<T>(promise: Promise<T>, timeout?: number): Promise<T>;
    /**
     * Adds new global headers to HTTP request configuration.
     *
     * @param headers - Headers to add.
     */
    addHeaders(headers: Record<string, string>): void;
    /**
     * Removes one or more global headers from HTTP request configuration.
     *
     * @param headerNames - Names of headers to remove.
     */
    removeHeaders(...headerNames: Array<string | string[]>): void;
    /**
     * Performs an HTTP request using the Fetch API with advanced configuration.
     *
     * @param url - Endpoint relative to the base API.
     * @param options - Request options.
     * @returns Promise with the processed response or an error.
     */
    fetch(url: string, options?: RequestAppGoat & {
        query?: Record<string, any>;
        format?: 'json' | 'text' | 'blob' | 'raw';
        timeout?: number;
        body?: any;
        headers?: Record<string, string>;
    }): Promise<any>;
    /**
     * Cancels HTTP requests when the maximum timeout is reached.
     *
     * @param controller - AbortController of the request to cancel.
     */
    onTimeout(controller: AbortController & {
        timeout?: boolean;
    }): void;
    /**
     * Returns the current application language.
     */
    getLang(): string;
}
declare const _default: AppGoatController;
export default _default;
//# sourceMappingURL=app-controller.d.ts.map