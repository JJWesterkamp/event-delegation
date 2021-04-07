import { EventHandler } from './EventHandler'
import { AskEvent, AskRoot, CreateFromObject, CreateParams } from './types'
import { createBuilder } from './lib/createBuilder'
import { normalizeRoot } from './lib/normalizeRoot'

const EventDelegation: AskRoot & CreateFromObject = {
    within<R extends Element>(rootOrSelector: string | R): AskEvent<R> {
        return createBuilder(
            normalizeRoot<R>(rootOrSelector)
        )
    },

    global(): AskEvent<HTMLElement> {
        return createBuilder(document.body)
    },

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
