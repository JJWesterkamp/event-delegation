import { closestUntil } from "./utils/closestUntil";

// ---------------------------------------------------------------------------
// Interface imports
// ---------------------------------------------------------------------------

import { IDelegationConfig } from "./private-interface";
import { IDelegationEvent, ISubscription } from "./public-interface";

// ---------------------------------------------------------------------------
// Implementation
// ---------------------------------------------------------------------------

export class EventHandler<T extends HTMLElement> implements ISubscription<T> {

    protected handler: (event: Event) => void;
    protected isAttached: boolean = false;
    protected isDestroyed: boolean = false;

    constructor(protected config: IDelegationConfig<T>) {
        this.createHandler();
        this.addListener();
    }

    public currentTarget(): HTMLElement {
        return this.config.currentTarget;
    }

    public remove(): void {
        this.removeListener();
        delete this.handler;
        delete this.config;
        this.isDestroyed = true;
        this.isAttached = false;
    }

    // ---------------------------------------------------------------------------
    // Construction
    // ---------------------------------------------------------------------------

    protected createHandler(): void {

        if (this.handler) {
            return;
        }

        this.handler = (event) => {

            const delegator = closestUntil(
                event.target as HTMLElement,
                this.config.selector,
                this.config.currentTarget,
            ) as T | null;

            if (delegator) {
                this.config.listener.call(delegator, this.decorateEvent(event, delegator));
            }
        };
    }

    protected decorateEvent(event: Event, delegator: T): IDelegationEvent<T> {
        return Object.assign(event, { delegator });
    }

    // ---------------------------------------------------------------------------
    // Adding / removing the listener
    // ---------------------------------------------------------------------------

    protected addListener(): void {

        if (this.isAttached || this.isDestroyed) {
            return;
        }

        this.config.currentTarget.addEventListener(
            this.config.event,
            this.handler,
            this.config.listenerOptions,
        );

        this.isAttached = true;
    }

    protected removeListener(): void {
        this.config.currentTarget.removeEventListener(this.config.event, this.handler);
    }
}
