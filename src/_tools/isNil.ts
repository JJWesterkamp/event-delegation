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
