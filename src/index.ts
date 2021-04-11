import type { AskEvent, AskRoot } from '../event-delegation'
import { createBuilder } from './lib/createBuilder'
import { createCompositeBuilder } from './lib/createCompositeBuilder'
import { isString } from './lib/assertions'
import { normalizeRoot } from './lib/normalizeRoot'

const EventDelegation: AskRoot = {

    // ----------------------------------------------------------------------------------------
    // Create a global delegated event listener.
    // ----------------------------------------------------------------------------------------

    global(): AskEvent<HTMLElement, 'SINGLE'> {
        return createBuilder(document.body)
    },

    // ----------------------------------------------------------------------------------------
    // Create one delegated event listener for a specified root element.
    // ----------------------------------------------------------------------------------------

    within(rootOrSelector: string | Element): AskEvent<any, 'SINGLE'> | never {
        return createBuilder(normalizeRoot(rootOrSelector))
    },

    // ----------------------------------------------------------------------------------------
    // Create many delegated event listeners for multiple specified root elements.
    // ----------------------------------------------------------------------------------------

    withinMany(rootsOrSelector: string | Element[]): AskEvent<any, 'MANY'> {
        const roots = isString(rootsOrSelector)
            ? Array.from(document.querySelectorAll(rootsOrSelector))
            : rootsOrSelector

        return createCompositeBuilder(roots.map(createBuilder))
    },
}

export default EventDelegation
