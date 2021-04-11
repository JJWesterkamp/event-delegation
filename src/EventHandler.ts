import { closestWithin } from './lib/closestWithin'
import { isNil } from './lib/assertions'
import type { DelegationConfig, EventHandler as EventHandlerInterface } from '../event-delegation'

export class EventHandler<R extends Element> implements EventHandlerInterface<R> {

    protected readonly handler: (event: Event) => void
    protected readonly actualListenerOptions: boolean | Readonly<AddEventListenerOptions> | undefined

    protected _isAttached: boolean = false
    protected _isDestroyed: boolean = false

    constructor(protected readonly config: DelegationConfig<R, any, any>) {

        // If config has an object for listenerOptions with { once: true }, create a surrogate
        // listenerOptions object with { once: false } for the actual native listener.
        // We want the listener to detach after one callback execution rather than after the first
        // event. The first event(s) might not match the given selector, resulting in the listener
        // callback to never run:
        this.actualListenerOptions = this.isOnceListener()
            ? Object.assign({}, config.listenerOptions, { once: false })
            : config.listenerOptions

        this.handler = (event) => {
            const delegator = closestWithin(event.target as HTMLElement, config.selector, config.root)

            if (isNil(delegator)) {
                return
            }

            config.listener.call(delegator, Object.assign(event, { delegator }))

            // If this is a { once: true } listener we'll manually remove the listener after the first matching event:
            if (this.isOnceListener()) {
                this.remove()
            }
        }

        config.root.addEventListener(
            config.eventType,
            this.handler,
            this.actualListenerOptions,
        )

        this._isAttached = true
    }

    public isAttached(): boolean {
        return this._isAttached
    }

    public isDestroyed(): boolean {
        return this._isDestroyed
    }

    public root(): R {
        return this.config.root
    }

    public selector(): string {
        return this.config.selector
    }

    public eventType(): string {
        return this.config.eventType
    }

    public remove(): void {
        if (this._isDestroyed) {
            return
        }

        this.config.root.removeEventListener(
            this.config.eventType,
            this.handler,
            this.actualListenerOptions,
        )

        this._isDestroyed = true
        this._isAttached = false
    }

    protected isOnceListener(): boolean {
        return typeof this.config.listenerOptions === 'object'
            && this.config.listenerOptions.once === true
    }
}
