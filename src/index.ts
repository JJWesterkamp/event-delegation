import { EventHandler } from './EventHandler'
import { AskRoot, CreateFromObject, CreateParams } from './types'
import { createBuilder } from './lib/createBuilder'
import { normalizeRoot } from './lib/normalizeRoot'

const EventDelegation: AskRoot & CreateFromObject = {

    global: () => createBuilder(document.body),

    within: (rootOrSelector: string | Element) => createBuilder(normalizeRoot(rootOrSelector)),


    create<
        D extends Element = Element,
        E extends Event = Event,
        R extends Element = Element
        >({ root, selector, eventType, listener, listenerOptions }: CreateParams<D, E, R>) {
        return new EventHandler<R | HTMLElement>({
            root: root ? normalizeRoot(root) : document.body,
            selector,
            eventType,
            listener,
            listenerOptions,
        })
    },
}

export default EventDelegation
