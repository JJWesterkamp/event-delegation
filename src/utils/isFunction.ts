/**
 * @param subject
 * @return {boolean}
 */
export function isFunction(subject: any): subject is () => any {
    return typeof subject === 'function';
}
