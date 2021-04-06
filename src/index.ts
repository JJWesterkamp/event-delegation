import { EventHandler } from './EventHandler'
import { AskEvent, AskRoot, CreateFromObject, CreateParams, } from './types'
import { createBuilder } from './lib/createBuilder'
import { normalizeRoot } from './lib/normalizeRoot'

const EventDelegation: CreateFromObject & AskRoot = {
    create<
        D extends Element = Element,
        E extends Event = Event,
        R extends Element = Element
        >(options: CreateParams<D, E, R>) {
        return new EventHandler<R | HTMLElement>({
            root: options.root ? normalizeRoot(options.root) : document.body,
            selector: options.selector,
            eventType: options.eventType,
            listener: options.listener,
            listenerOptions: options.listenerOptions,
        })
    },

    within<R extends Element>(rootOrSelector: string | R): AskEvent<R> {
        return createBuilder(
            normalizeRoot<R>(rootOrSelector)
        )
    },

    global(): AskEvent<HTMLElement> {
        return createBuilder(document.body)
    },
}

export default EventDelegation
