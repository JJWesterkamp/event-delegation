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

export const createCompositeBuilder = <R extends Element>(builders: AskEvent<R, 'SINGLE'>[]): AskEvent<R, 'MANY'> => ({
    events: (eventType: string) => ({
        select: (selector: string) => ({
            listen: (listener: DelegationListener<any, any, R>, listenerOptions?: AddEventListenerOptions) => {
                // Todo: make reducer
                return builders.map((builder) => builder
                    .events(eventType)
                    .select(selector)
                    .listen(listener, listenerOptions)
                )
            }
        })
    })
})
