import { AskRoot } from './types'
import { createBuilder, createCompositeBuilder } from './lib/createBuilder'
import { isString } from './lib/isString'
import { normalizeRoot } from './lib/normalizeRoot'

const EventDelegation: AskRoot = {

    global: () => createBuilder(document.body),

    within: (rootOrSelector: string | Element) => createBuilder(normalizeRoot(rootOrSelector)),

    withinMany: (rootsOrSelector: string | Element[]) => {
        const roots = isString(rootsOrSelector)
            ? Array.from(document.querySelectorAll(rootsOrSelector))
            : rootsOrSelector

        return createCompositeBuilder(
            roots.map(createBuilder)
        )
    },
}

export default EventDelegation
