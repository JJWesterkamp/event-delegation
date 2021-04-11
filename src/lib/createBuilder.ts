import { DelegationListener } from '../types'
import { EventHandler } from '../EventHandler'

export const createBuilder = <R extends Element>(root: R) => ({
    events: (eventType: string) => ({
        select: (selector: string) => ({
            listen: (listener: DelegationListener<any, any, any>, listenerOptions?: AddEventListenerOptions): EventHandler<R> => new EventHandler({
                root,
                eventType,
                selector,
                listener,
                listenerOptions,
            })
        })
    })
})
