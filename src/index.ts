import { EventHandler } from './EventHandler'
import { isString } from './_tools/isString'
import { isNil } from './_tools/isNil'
import {
    AskEvent,
    AskListener,
    AskRoot,
    AskSelector,
    CreateFromObject,
    CreateParams,
    DelegationListener,
} from './_types'

function normalizeRoot<R extends Element>(rootOrSelector: string | R): R {
    if (isString(rootOrSelector)) {
        const rootOrNull = document.querySelector<R>(rootOrSelector)

        if (isNil(rootOrNull)) {
            throw new Error(`Couldn't find any root element matching selector ${rootOrSelector}`)
        }

        return rootOrNull
    }

    return rootOrSelector
}


const EventDelegation: CreateFromObject & AskRoot = {

    create<E extends Event = Event,
        D extends Element = Element,
        R extends Element = Element,
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
        return builder(
            normalizeRoot<R>(rootOrSelector)
        )
    },

    global(): AskEvent<Element> {
        return builder(document.body)
    },
}

const builder = <Root extends Element>(root: Root): AskEvent<Root> => ({
    events: (eventType: string): AskSelector<Root> => ({
        select: (selector: string): AskListener<Root> => ({
            listen: (listener: DelegationListener<any, any>, listenerOptions?: AddEventListenerOptions) => new EventHandler({
                root,
                eventType,
                selector,
                listener,
                listenerOptions,
            })
        })
    })
})

const x = EventDelegation
    .within<HTMLFormElement>('#my-form')
    .events('click')
    .select('button')
    .listen((e) => e.delegator.disabled)

