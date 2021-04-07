/**
 * Returns `true` if the given argument is a string, or `false` otherwise.
 *
 * @param subject
 * @return {boolean}
 */
export function isString(subject: any): subject is string {
    return typeof subject === 'string'
}
