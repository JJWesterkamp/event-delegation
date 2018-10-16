import { InvalidArgumentError } from "./errors/index";
import { EventHandler } from "./EventHandler";
import "./polyfill/element.matches";
import { isFunction, isString } from "./utils/index";

// ---------------------------------------------------------------------------
// Interface imports
// ---------------------------------------------------------------------------

import PublicInterface from "../event-delegation.d";
import { DelegationConfig } from "./private-interface";

import IStatic       = PublicInterface.Static;
import IOptions      = PublicInterface.Options;
import ISubscription = PublicInterface.Subscription;

// ---------------------------------------------------------------------------
// Interface exports & implementation
// ---------------------------------------------------------------------------

const defaultNamespace: IStatic = { create };
export default defaultNamespace;

function create(options: IOptions): ISubscription {
    const config: DelegationConfig = createConfig(options);
    return new EventHandler(config);
}

/**
 * @param options
 */
function createConfig(options: IOptions): DelegationConfig {

    const result: DelegationConfig = Object.assign({}, options, {
        currentTarget: normalizeCurrentTarget(options.currentTarget),
    });

    try {
        document.querySelector(result.selector);
    } catch (err) {
        throw new InvalidArgumentError("options.selector is not a valid selector");
    }

    if ( ! isFunction(result.listener)) {
        throw new InvalidArgumentError("options.listener must be a function");
    }

    return result;
}

/**
 *
 * @param {string|HTMLElement} [input]
 */
function normalizeCurrentTarget(input: IOptions["currentTarget"]): HTMLElement {

    if (input instanceof HTMLElement) {
        return input;
    }

    const defaultElement: HTMLElement = document.body;

    if ( ! (isString(input) && input.length > 0)) {
        return defaultElement;
    }

    try {
        const match = document.body.querySelector<HTMLElement>(input);
        return match || defaultElement;
    } catch (err) {
        return defaultElement;
    }
}
