import { InvalidArgumentError } from "./errors";
import { EventHandler } from "./EventHandler";
import "./polyfill/element.matches";
import { isFunction, isString } from "./utils";

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
        delegatee: normalizeDelegatee(options.delegatee),
    });

    try {
        document.querySelector(result.delegatorSelector);
    } catch (err) {
        throw new InvalidArgumentError("options.delegatorSelector is not a valid selector");
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
function normalizeDelegatee(input: IOptions["delegatee"]): HTMLElement {

    if (input instanceof HTMLElement) {
        return input;
    }

    const defaultElement: HTMLElement = document.body;

    if (isString(input) && input.length > 0) {
        const match = document.body.querySelector<HTMLElement>(input);
        return match || defaultElement;
    }

    return defaultElement;
}
