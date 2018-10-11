import { evolve } from "ramda";
import { InvalidArgumentError } from "../errors/InvalidArgumentError";
import { DelegationConfig } from "../private-interface";
// ---------------------------------------------------------------------------
// Interface imports
// ---------------------------------------------------------------------------

import PublicInterface from "../../event-delegation";
import IOptions = PublicInterface.IOptions;
import { InvalidConfigurationError } from "../errors/InvalidConfigurationError";

/**
 * @param options
 */
export function createConfig(options: IOptions): DelegationConfig {

    if (isString(options.delegatee)) {
        options.delegatee = document.body.querySelector<HTMLElement>(options.delegatee);
    }

    if ( ! (options.delegatee && document.body.contains(options.delegatee))) {
        throw new InvalidArgumentError("options.delegatee is not a valid selector or element");
    }

    try {
        document.querySelector(options.delegatorSelector);
    } catch (err) {
        throw new InvalidArgumentError("options.delegatorSelector is not a valid selector");
    }

    if ( ! isListener(options.listener)) {
        throw new InvalidArgumentError("options.listener must be a function");
    }

    return options;
}

/**
 *
 * @param options
 */
function validateConfig(options: IOptions): options is DelegationConfig {
    return options.delegatee instanceof HTMLElement
        && true;
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
