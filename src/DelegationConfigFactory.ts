import { InvalidArgumentError } from "./errors";
import { IDelegationConfig } from "./private-interface";
import { IOptions } from "./public-interface";
import { isFunction, isString } from "./utils";

export class DelegationConfigFactory {

    public fromOptions<T extends HTMLElement>(options: IOptions<T>): IDelegationConfig<T> {

        const result: IDelegationConfig<T> = Object.assign({}, options, {
            currentTarget: this.normalizeCurrentTarget(options.currentTarget),
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
    protected normalizeCurrentTarget(input?: HTMLElement | string): HTMLElement {

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

}