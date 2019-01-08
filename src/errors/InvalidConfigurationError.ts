import { AbstractError } from './AbstractError';

export class InvalidConfigurationError extends AbstractError {

    constructor() {
        super('Invalid configuration');
    }
}
