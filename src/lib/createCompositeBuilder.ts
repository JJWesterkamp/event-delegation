import type { AskEvent, DelegationListener } from '../../event-delegation'

export const createCompositeBuilder = <R extends Element>(builders: AskEvent<R, 'SINGLE'>[]): AskEvent<R, 'MANY'> => ({
    events: (eventType: string) => ({
        select: (selector: string) => ({
            listen: (listener: DelegationListener<any, any, R>, listenerOptions?: AddEventListenerOptions) => {
                return builders.map((builder) => builder
                    .events(eventType)
                    .select(selector)
                    .listen(listener, listenerOptions)
                )
            }
        })
    })
})
