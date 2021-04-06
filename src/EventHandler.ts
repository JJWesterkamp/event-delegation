import { closestWithin } from './_tools/closestWithin'
import { DelegationConfig, EventHandler as EventHandlerInterface } from './_types'

export class EventHandler<R extends Element> implements EventHandlerInterface<R> {

    protected handler: (event: Event) => void
    protected _isAttached: boolean = false
    protected _isDestroyed: boolean = false

    constructor(protected config: DelegationConfig<R, any, any>) {

        this.handler = (event) => {
            const delegator = this.findDelegator(event)
            if (delegator) {
                this.config.listener.call(delegator, Object.assign(event, { delegator }))
            }
        }

        this.addListener()
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

    public event(): string {
        return this.config.eventType
    }

    public remove(): void {
        this.removeListener()
        // delete this.handler
        // delete this.config
        this._isDestroyed = true
        this._isAttached = false
    }

    // ---------------------------------------------------------------------------
    // Construction
    // ---------------------------------------------------------------------------

    protected findDelegator(event: Event): HTMLElement | null {
        return closestWithin(
            event.target as HTMLElement,
            this.config.selector,
            this.config.root,
        )
    }

    // ---------------------------------------------------------------------------
    // Adding / removing the listener
    // ---------------------------------------------------------------------------

    protected addListener(): void {

        if (this._isAttached || this._isDestroyed) {
            return
        }

        this.config.root.addEventListener(
            this.config.eventType,
            this.handler,
            this.config.listenerOptions,
        )

        this._isAttached = true
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
