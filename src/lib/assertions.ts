 export function isNil(subject: any): subject is null | undefined {
    return subject === null || subject === undefined
}

 export function isString(subject: any): subject is string {
    return typeof subject === 'string'
}

 export function isFunction(subject: any): subject is Function {
    return typeof subject === 'function'
}