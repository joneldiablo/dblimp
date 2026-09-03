"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppGoatController = exports.AppGoatError = exports.AppGoatAbortController = void 0;
const url_join_1 = __importDefault(require("url-join"));
const object_mutation_1 = require("dbl-utils/object-mutation");
const resolve_refs_1 = __importDefault(require("dbl-utils/resolve-refs"));
const utils_1 = require("dbl-utils/utils");
const event_handler_1 = __importDefault(require("dbl-utils/event-handler"));
const flat_1 = require("dbl-utils/flat");
const i18n_1 = require("dbl-utils/i18n");
const components_1 = require("./components");
const controllers_1 = require("./controllers");
const fields_1 = require("./fields");
// Global state kept in memory
const GLOBAL_STATE = {};
class AppGoatAbortController extends AbortController {
}
exports.AppGoatAbortController = AppGoatAbortController;
class AppGoatError extends Error {
    constructor() {
        super(...arguments);
        this.error = true;
    }
}
exports.AppGoatError = AppGoatError;
/**
 * Main controller that manages application configuration and global state.
 *
 * @example
 * ```ts
 * const app = new AppGoatController();
 * app.set("token", "123");
 * ```
 */
class AppGoatController {
    constructor(props) {
        // Stores AbortControllers for active requests
        this.fetchList = {};
        // Stores global definitions
        this.globalDefinitions = [];
        // Stores routes indexed by view name
        this.routes = {};
        // Temporary counter for routes found during initialization
        this.tmpRoutesFound = 0;
        // Random identifier for this instance
        this.random = (0, utils_1.randomS4)();
        // Prefix used for local and session storage
        this.prefixStorage = '_gs.';
        if (props)
            this.init(props);
    }
    /**
     * Initializes the AppGoatController configuration.
     *
     * @param props - Initial properties to configure the application.
     */
    init(props = {}) {
        const { definitions = [], routes = [], fields = {}, components = {}, controllers = {}, icons = false, schema = {
            view: {
                name: 'appEmpty',
                path: '/',
                content: 'Root empty site'
            }
        }, api = "http://localhost:3000/", apiHeaders = {}, fetchBefore = (url, options) => options, fetchAfter = res => res, fetchError = (error, url) => error, maxTimeout = 0, minTimeout = 1000, dictionary = {}, formatDate = {}, formatNumber = {}, formatTime = {}, formatDateTime = {}, lang = 'default', initialState = {} } = props;
        // Save complete initial properties
        this.props = {
            definitions,
            routes,
            fields,
            components,
            controllers,
            icons,
            schema,
            api,
            apiHeaders,
            fetchBefore,
            fetchAfter,
            fetchError,
            maxTimeout,
            minTimeout,
            dictionary,
            formatDate,
            formatNumber,
            formatTime,
            formatDateTime,
            lang,
            initialState
        };
        // Register global icons if provided
        // Combine initial global definitions
        this.globalDefinitions.push(...(Array.isArray(definitions) ? definitions : [definitions]));
        // Index routes by view name and warn about overwrites
        this.routes = routes.reduce((rdx, route) => {
            if (rdx[route.view.name]) {
                console.warn(`Route ${route.view.name} overwritten`);
            }
            rdx[route.view.name] = route;
            return rdx;
        }, {});
        // Register global field, component and controller extensions
        if (fields)
            (0, fields_1.addFields)(fields);
        if (components)
            (0, components_1.addComponents)(components);
        if (controllers)
            (0, controllers_1.addControllers)(controllers);
        // Add custom global formats
        if (dictionary)
            (0, i18n_1.addDictionary)(dictionary);
        if (formatDate)
            (0, i18n_1.addFormatDate)(formatDate);
        if (formatNumber)
            (0, i18n_1.addFormatNumber)(formatNumber);
        if (formatTime)
            (0, i18n_1.addFormatTime)(formatTime);
        if (formatDateTime)
            (0, i18n_1.addFormatDateTime)(formatDateTime);
        // Set global language
        if (lang)
            (0, i18n_1.setLang)(lang);
        // Set initial state in storage or GLOBAL_STATE
        if (initialState) {
            const keys = [
                ...Object.keys(sessionStorage),
                ...Object.keys(localStorage)
            ]
                .filter(k => k.startsWith(this.prefixStorage))
                .map(k => k.replace(this.prefixStorage, ''));
            Object.entries(initialState).forEach(([key, value]) => {
                if (keys.includes(key)) {
                    this.get(key);
                }
                else {
                    GLOBAL_STATE[key] = value;
                }
            });
        }
        // Prepare root schema and routes
        schema.view.path = schema.view.path || '/';
        this.rootSchema = this.buildRootSchema(schema);
        // Informative log of total routes
        console.info('Total Routes:', this.tmpRoutesFound);
    }
    /**
     * Recursively processes a route schema to build a navigable structure.
     *
     * @param schema - Route schema to process.
     * @returns The processed view schema with nested routes resolved.
     */
    findingRoutesRecursive(schema) {
        var _a;
        // Increase the temporary counter of found routes
        this.tmpRoutesFound++;
        // Merge global definitions with the current schema's definitions
        const newDefs = (0, object_mutation_1.deepMerge)({}, ...this.globalDefinitions, schema.definitions || {});
        // Resolve view internal references using combined definitions
        const view = (0, resolve_refs_1.default)(schema.view, { definitions: newDefs, data: schema.data || {} });
        // Process nested routes if present
        if ((_a = schema.routes) === null || _a === void 0 ? void 0 : _a.length) {
            view.routes = Object.entries((0, resolve_refs_1.default)(schema.routes, { routes: this.routes })).map(([key, route]) => {
                // Error handling: route without defined view
                if (!(route && route.view)) {
                    console.error('ROUTE VIEW NOT FOUND', route);
                    return {
                        name: `${view.name}.${key}`,
                        path: `/${view.name}-${key}`,
                        tag: 'error',
                        content: `
            <p class='text-danger'>NOT FOUND</p>
            <p class='bg-dark text-light'><pre>${JSON.stringify(schema, null, 2)}</pre></p>
          `
                    };
                }
                // Recursive call to continue processing nested routes
                return this.findingRoutesRecursive(route);
            });
        }
        // Return the processed view
        return view;
    }
    /**
     * Builds the root schema from the initial schema, resolving all nested routes.
     *
     * @param schema - Initial schema to start from.
     * @returns Fully processed root schema.
     */
    buildRootSchema(schema) {
        // Reset the temporary route counter
        this.tmpRoutesFound = 0;
        // Build the root schema invoking the recursive function
        const root = this.findingRoutesRecursive(schema);
        // Log the total number of routes after building
        console.info('Total Routes:', this.tmpRoutesFound);
        // Return the fully resolved root schema
        return root;
    }
    /**
     * Converts a JavaScript object to a JSON string.
     * Encryption is not implemented yet.
     *
     * @param data - Object to stringify.
     * @param encrypt - Whether to encrypt the string (pending).
     */
    stringify(data, encrypt = false) {
        return JSON.stringify(data);
    }
    /**
     * Parses a JSON string back to an object.
     * Decryption is not implemented yet.
     *
     * @param data - JSON string to parse.
     */
    parse(data) {
        return JSON.parse(data);
    }
    /**
     * Saves a value in the global storage and optionally in localStorage/sessionStorage.
     *
     * @param key - Key used to identify the stored value.
     * @param data - Value to store.
     * @param options - Storage options.
     */
    set(key, data, { dispatch = true, storage = 'local', encrypt = false } = {}) {
        // Save in localStorage or sessionStorage according to option
        if (storage === 'local') {
            localStorage.setItem(this.prefixStorage + key, this.stringify(data, encrypt));
        }
        else if (storage === 'session') {
            sessionStorage.setItem(this.prefixStorage + key, this.stringify(data, encrypt));
        }
        // Save in memory (GLOBAL_STATE)
        GLOBAL_STATE[key] = data;
        // Dispatch global event indicating the key was updated
        if (dispatch) {
            event_handler_1.default.dispatch('global.' + key, data);
        }
    }
    /**
     * Retrieves a value from global or browser storage.
     *
     * @param key - Key of the desired value.
     * @returns Stored value or undefined.
     */
    get(key) {
        // Retrieve from GLOBAL_STATE if already present
        if (GLOBAL_STATE[key] === undefined) {
            // Try to retrieve from sessionStorage
            let value = sessionStorage.getItem(this.prefixStorage + key);
            // If not in sessionStorage, try localStorage
            if (value === null) {
                value = localStorage.getItem(this.prefixStorage + key);
            }
            // If found, save in GLOBAL_STATE
            if (value !== null) {
                GLOBAL_STATE[key] = this.parse(value);
            }
        }
        return GLOBAL_STATE[key];
    }
    /**
     * Removes a value from global and optional browser storage.
     *
     * @param key - Key of the value to remove.
     * @param options - Removal options.
     */
    remove(key, { storage = null, dispatch = true } = {}) {
        // Remove from the specified storage or both
        if (storage === 'local') {
            localStorage.removeItem(this.prefixStorage + key);
        }
        else if (storage === 'session') {
            sessionStorage.removeItem(this.prefixStorage + key);
        }
        else {
            localStorage.removeItem(this.prefixStorage + key);
            sessionStorage.removeItem(this.prefixStorage + key);
        }
        // Remove from GLOBAL_STATE
        delete GLOBAL_STATE[key];
        // Dispatch global event indicating the key was removed
        if (dispatch) {
            event_handler_1.default.dispatch('global.' + key);
        }
    }
    /**
     * Retrieves all global definitions combined with the root schema definitions.
     *
     * @returns Fully resolved definitions object.
     */
    getRootDefinitions() {
        const allDefs = (0, object_mutation_1.deepMerge)({}, ...this.globalDefinitions, this.props.schema.definitions || {});
        return (0, resolve_refs_1.default)(allDefs, { definitions: allDefs });
    }
    /**
     * Gets combined and resolved definitions for a view by name.
     *
     * @param name - View name to retrieve definitions for.
     * @returns Resolved view definitions or an empty object.
     */
    getViewDefinitions(name) {
        var _a;
        if (!((_a = this.routes[name]) === null || _a === void 0 ? void 0 : _a.definitions))
            return {};
        const allDefs = (0, object_mutation_1.deepMerge)({}, ...this.globalDefinitions, this.routes[name].definitions || {});
        return (0, resolve_refs_1.default)(allDefs, { definitions: allDefs });
    }
    /**
     * Returns all current global definitions.
     *
     * @returns Array of global definitions.
     */
    getGlobalDefinitions() {
        const allDefs = (0, object_mutation_1.deepMerge)({}, ...this.globalDefinitions);
        return (0, resolve_refs_1.default)(allDefs, { definitions: allDefs });
    }
    /**
     * Returns the keys currently stored in global state.
     *
     * @returns Array of global state keys.
     */
    getGlobalKeys() {
        return Object.keys(GLOBAL_STATE);
    }
    /**
     * Executes a promise ensuring a minimum wait time.
     *
     * @param promise - Promise to execute.
     * @param timeout - Minimum time in milliseconds before resolving.
     * @returns Result of the original promise after waiting.
     */
    async minTimeout(promise, timeout = this.props.minTimeout) {
        const [result] = await Promise.all([
            promise,
            new Promise(resolve => setTimeout(resolve, timeout))
        ]);
        return result;
    }
    /**
     * Adds new global headers to HTTP request configuration.
     *
     * @param headers - Headers to add.
     */
    addHeaders(headers) {
        Object.assign(this.props.apiHeaders, headers);
    }
    /**
     * Removes one or more global headers from HTTP request configuration.
     *
     * @param headerNames - Names of headers to remove.
     */
    removeHeaders(...headerNames) {
        const apiHeaders = this.props.apiHeaders;
        headerNames
            .flat()
            .filter(Boolean)
            .forEach((headerName) => {
            delete apiHeaders[headerName];
        });
    }
    /**
     * Performs an HTTP request using the Fetch API with advanced configuration.
     *
     * @param url - Endpoint relative to the base API.
     * @param options - Request options.
     * @returns Promise with the processed response or an error.
     */
    fetch(url, options = {}) {
        options.method = options.method || 'GET';
        const requestKey = `${options.method}${url}`;
        // AbortController to cancel previous active requests
        if (this.fetchList[requestKey]) {
            this.fetchList[requestKey].abort();
        }
        const { query = {}, format = 'json', timeout = this.props.maxTimeout, body, headers, ...confraw } = this.props.fetchBefore(url, options);
        const conf = confraw;
        if (body)
            conf.body = JSON.stringify(body);
        // Build final URL with query params
        const finalUrl = new URL((0, url_join_1.default)(this.props.api, url));
        const flattenQuery = (0, flat_1.flatten)(query, { ommitArrays: true });
        Object.entries(flattenQuery).forEach(([key, value]) => {
            if (Array.isArray(value)) {
                value.forEach(v => finalUrl.searchParams.append(key, v));
            }
            else if (['number', 'boolean', 'string'].includes(typeof value)) {
                finalUrl.searchParams.set(key, value);
            }
        });
        // Handle timeout with custom AbortController
        if (timeout) {
            const abortCtrl = new AppGoatAbortController();
            this.fetchList[requestKey] = abortCtrl;
            conf.signal = abortCtrl.signal;
            abortCtrl.timeoutId = setTimeout(() => this.onTimeout(abortCtrl), timeout);
        }
        // Prepare final headers
        const apiHeaders = typeof this.props.apiHeaders === 'object'
            ? this.props.apiHeaders
            : typeof this.props.apiHeaders === 'string'
                ? this.props.apiHeaders.split('|').reduce((acc, c) => {
                    const [key, ...value] = c.split(':').map(s => s.trim());
                    acc[key] = value.join(':');
                    return acc;
                }, {})
                : {};
        conf.headers = {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            ...apiHeaders,
            ...headers
        };
        const fetchPromise = fetch(finalUrl.toString(), conf)
            .then(async (r) => {
            delete this.fetchList[requestKey];
            if (!r.ok) {
                const err = new Error(r.statusText);
                err.status = r.status;
                const json = await r.json();
                Object.assign(err, json);
                throw err;
            }
            return format === 'raw' ? r : r[format]();
        })
            .catch(e => {
            e.error = true;
            if (e.name === 'AbortError') {
                const timeoutErr = new AppGoatError('timeout');
                timeoutErr.message = 'timeout';
                timeoutErr.error = true;
                return this.props.fetchError(timeoutErr, url);
            }
            console.error(e);
            return this.props.fetchError(e, url);
        })
            .then(this.props.fetchAfter)
            .finally(() => {
            if (timeout && this.fetchList[requestKey]) {
                clearTimeout(this.fetchList[requestKey].timeoutId);
                delete this.fetchList[requestKey];
            }
        });
        return this.minTimeout(fetchPromise);
    }
    /**
     * Cancels HTTP requests when the maximum timeout is reached.
     *
     * @param controller - AbortController of the request to cancel.
     */
    onTimeout(controller) {
        controller.timeout = true;
        controller.abort();
    }
    /**
     * Returns the current application language.
     */
    getLang() {
        return (0, i18n_1.getLang)();
    }
}
exports.AppGoatController = AppGoatController;
exports.default = new AppGoatController();
//# sourceMappingURL=app-controller.js.map