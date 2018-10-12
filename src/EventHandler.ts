import { DelegationConfig } from "./private-interface";
import { closestUntil } from "./utils/closestUntil";

// ---------------------------------------------------------------------------
// Interface imports
// ---------------------------------------------------------------------------

import PublicInterface from "../event-delegation";
import ISubscription = PublicInterface.Subscription;

// ---------------------------------------------------------------------------
// Implementation
// ---------------------------------------------------------------------------

export class EventHandler implements ISubscription {

    protected handler: (event: Event) => void;
    protected isAttached: boolean = false;
    protected isDestroyed: boolean = false;

    constructor(protected config: DelegationConfig) {

        this.handler = (event) => {

            const delegator = closestUntil(
                event.target as HTMLElement,
                this.config.delegatorSelector,
                this.config.delegatee,
            );

            if (delegator) {
                this.config.listener.call(delegator, event);
            }
        };

        this.addListener();
    }

    public remove(): void {
        this.removeListener();
        delete this.handler;
        delete this.config;
        this.isDestroyed = true;
        this.isAttached = false;
    }

    // ---------------------------------------------------------------------------
    // Adding / removing the listener
    // ---------------------------------------------------------------------------

    protected addListener(): void {
        if ( ! this.isDestroyed) {
            this.config.delegatee.addEventListener(this.config.eventName, this.handler);
            this.isAttached = true;
        }
    }

    protected removeListener(): void {
        this.config.delegatee.removeEventListener(this.config.eventName, this.handler);
    }
}
