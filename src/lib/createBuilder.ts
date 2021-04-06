import { AskEvent, AskListener, AskSelector, DelegationListener } from '../event-delegation.types'
import { EventHandler } from '../EventHandler'

export const createBuilder = <Root extends Element>(root: Root): AskEvent<Root> => ({
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
