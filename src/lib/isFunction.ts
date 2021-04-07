/**
 * Returns `true` if the given argument is a function, or `false` otherwise.
 *
 * @param subject
 * @return {boolean}
 */
export function isFunction(subject: any): subject is Function {
    return typeof subject === 'function'
}
