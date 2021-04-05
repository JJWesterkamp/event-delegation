/**
 * @param subject
 * @return {boolean}
 */
export function isFunction(subject: any): subject is Function {
    return typeof subject === 'function';
}
