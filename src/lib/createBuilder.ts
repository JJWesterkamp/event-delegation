import { AskEvent, DelegationListener } from '../types'
import { EventHandler } from '../EventHandler'

export const createBuilder = <R extends Element>(root: R): AskEvent<R, 'SINGLE'> => ({
    events: (eventType: string) => ({
        select: (selector: string) => ({
            listen: (listener: DelegationListener<any, any, R>, listenerOptions?: AddEventListenerOptions) => {
                return new EventHandler({
                    root,
                    eventType,
                    selector,
                    listener,
                    listenerOptions,
                })
            }
        })
    })
})
