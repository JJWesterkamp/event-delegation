import { closestWithin } from './lib/closestWithin'
import { DelegationConfig, EventHandler as EventHandlerInterface } from './types'

export class EventHandler<R extends Element> implements EventHandlerInterface<R> {

    protected handler: (event: Event) => void
    protected _isAttached: boolean = false
    protected _isDestroyed: boolean = false

    constructor(protected config: DelegationConfig<R, any, any>) {
        this.handler = (event) => {
            const delegator = closestWithin(event.target as HTMLElement, config.selector, config.root)
            if (delegator) {
                config.listener.call(delegator, Object.assign(event, { delegator }))
            }
        }

        config.root.addEventListener(
            this.config.eventType,
            this.handler,
            this.config.listenerOptions,
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
        this.removeListener()
        this._isDestroyed = true
        this._isAttached = false
    }

    protected removeListener(): void {
        if (this._isDestroyed) {
            return
        }

        this.config.root.removeEventListener(
            this.config.eventType,
            this.handler,
            this.config.listenerOptions,
        )
    }
}
