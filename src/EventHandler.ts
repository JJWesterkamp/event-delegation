import { closestWithin } from './utils';

// ---------------------------------------------------------------------------
// Interface imports
// ---------------------------------------------------------------------------

import { IDelegationConfig } from './private-interface';
import { IDelegationEvent, IDelegationListener } from './public-interface';

// ---------------------------------------------------------------------------
// Implementation
// ---------------------------------------------------------------------------

export class EventHandler<T extends HTMLElement = HTMLElement> implements IDelegationListener {

    protected handler: (event: Event) => void;
    protected isAttached: boolean = false;
    protected isDestroyed: boolean = false;

    constructor(protected config: IDelegationConfig<T>) {

        this.handler = (event) => {
            const delegator = this.findDelegator(event);
            if (delegator) { this.callListener(event, delegator); }
        };

        this.addListener();
    }

    public root(): HTMLElement {
        return this.config.root;
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

    protected findDelegator(event: Event): T | null {

        return closestWithin(
            event.target as HTMLElement,
            this.config.selector,
            this.config.root,
        ) as T | null;
    }

    protected callListener(event: Event, delegator: T): void {
        this.config.listener.call(delegator, this.decorateEvent(event, delegator));
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

        this.config.root.addEventListener(
            this.config.eventType,
            this.handler,
            this.config.listenerOptions,
        );

        this.isAttached = true;
    }

    protected removeListener(): void {
        this.config.root.removeEventListener(this.config.eventType, this.handler);
    }
}
