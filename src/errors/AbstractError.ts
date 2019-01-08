export abstract class AbstractError extends Error {

    constructor(message: string) {
        super('[EventDelegation] ' + message);
    }
}
