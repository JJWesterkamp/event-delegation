/**
 *
 * @param subject
 */
export function isString(subject: any): subject is string {
    return typeof subject === 'string';
}
