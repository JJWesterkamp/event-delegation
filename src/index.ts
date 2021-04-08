import { AskRoot } from './types'
import { createBuilder } from './lib/createBuilder'
import { normalizeRoot } from './lib/normalizeRoot'

const EventDelegation: AskRoot = {

    global: () => createBuilder(document.body),

    within: (rootOrSelector: string | Element) => createBuilder(normalizeRoot(rootOrSelector)),
}

export default EventDelegation
