import { AbstractError } from "./AbstractError";

export class InvalidArgumentError extends AbstractError {

    constructor(message: string) {
        super("Invalid argument: " + message);
    }
}
