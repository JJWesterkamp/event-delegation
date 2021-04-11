/**
 * Returns `true` if the given argument is a string, or `false` otherwise.
 *
 * @param subject
 * @return {boolean}
 */
 export function isNil(subject: any): subject is null | undefined {
    return subject === null
        || subject === undefined
}

/**
 * Returns `true` if the given argument is a string, or `false` otherwise.
 *
 * @param subject
 * @return {boolean}
 */
 export function isString(subject: any): subject is string {
    return typeof subject === 'string'
}

/**
 * Returns `true` if the given argument is a function, or `false` otherwise.
 *
 * @param subject
 * @return {boolean}
 */
 export function isFunction(subject: any): subject is Function {
    return typeof subject === 'function'
}