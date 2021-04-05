import { InvalidArgumentError } from './errors';
import { IDelegationConfig } from './private-interface';
import { IOptions } from './public-interface';
import { isString } from './_tools/isString'
import { isFunction } from './_tools/isFunction'

export class DelegationConfigFactory {

    public fromOptions<T extends HTMLElement>(options: IOptions<T>): IDelegationConfig<T> {

        const result: IDelegationConfig<T> = Object.assign({}, options, {
            root: this.normalizeRoot(options.root),
        });

        this.expectValidResult<T>(result);

        return result;
    }

    // noinspection JSMethodCanBeStatic
    /**
     *
     * @param {string|HTMLElement} [input]
     */
    protected normalizeRoot(input?: HTMLElement | string): HTMLElement {

        if (input instanceof HTMLElement) {
            return input;
        }

        const defaultElement: HTMLElement = document.body;

        if ( ! (isString(input) && input.length > 0)) {
            return defaultElement;
        }

        return document.querySelector<HTMLElement>(input) || defaultElement;
    }

    protected expectValidResult<T extends HTMLElement>(result: IDelegationConfig<T>): void {
        try {
            document.querySelector(result.selector);
        } catch (err) {
            throw new InvalidArgumentError('options.selector is not a valid selector');
        }

        if ( ! isFunction(result.listener)) {
            throw new InvalidArgumentError('options.listener must be a function');
        }
    }
}
