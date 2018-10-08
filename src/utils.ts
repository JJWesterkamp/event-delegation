// ---------------------------------------------------------------------------
// Interface imports
// ---------------------------------------------------------------------------
import PublicInterface from "../event-delegation.d";
import { DelegationConfig } from "./private-interface";
import IOptions = PublicInterface.DelegationOptions;

/**
 * Queries up the DOM for given `selector`, starting from given `startNode`.
 * The first element found matching `selector` will be returned.
 * Querying will stop as soon as given `untilElement` is encountered.
 * If no matching element was found, `null` is returned.
 *
 * @param {HTMLElement} startElement    The innermost element in the DOM tree to start searching from.
 * @param {string}      selector        The selector (CSS style) to match anchestor elements with.
 * @param {HTMLElement} untilElement    The element that acts as a scope for the query.
 *
 * Based on the MDN `closest` polyfill:
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Element/closest#Polyfill
 */
export function closestUntil(startElement: HTMLElement, selector: string, untilElement: HTMLElement = document.body): HTMLElement | null {

    if ( ! document.documentElement.contains(startElement)) {
        return null;
    }

    let current: HTMLElement = startElement;

    do {
        if (current.matches(selector)) {
            return current;
        }

        current = current.parentElement || current.parentNode as HTMLElement;

    } while (current && current !== untilElement && current.nodeType === 1);

    return null;
}

/**
 *
 * @param options
 */
export function createConfig(options: IOptions): DelegationConfig {

    const mutations: Partial<DelegationConfig> = {};

    if (isString(options.delegatee)) {
        mutations.delegatee = document.body.querySelector(options.delegatee) as HTMLElement;
    }

    const config = Object.assign({}, options, mutations);

    validateConfig(config);

    return config;
}

/**
 *
 * @param config
 */
function validateConfig(config: DelegationConfig): void {

    if ( ! (config.delegatee && document.body.contains(config.delegatee))) {
        throw new Error("Invalid argument: options.delegatee is not a valid selector or element");
    }

    try {
        document.querySelector(config.delegatorSelector);
    } catch (err) {
        throw new Error("Invalid argument: options.delegatorSelector is not a valid selector");
    }

    if ( ! isListener(config.listener)) {
        throw new Error("Invalid argument: options.listener must be a function");
    }
}

/**
 *
 * @param subject
 */
export function isString(subject: any): subject is string {
    return typeof subject === "string";
}

/**
 *
 * @param subject
 */
export function isListener(subject: any): subject is (event: Event) => void {
    return typeof subject === "function";
}
