import { isNil, isString } from './assertions'

export function normalizeRoot<R extends Element>(rootOrSelector: string | R): R | never {
    if (isString(rootOrSelector)) {
        const rootOrNull = document.querySelector<R>(rootOrSelector)

        if (isNil(rootOrNull)) {
            throw new Error(`Couldn't find any root element matching selector '${rootOrSelector}'.`)
        }

        return rootOrNull
    }

    return rootOrSelector
}
