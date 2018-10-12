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

    public suspend(): void {
        this.removeListener();
        delete this.handler;
        delete this.config;
    }

    // ---------------------------------------------------------------------------
    // Adding / removing the listener
    // ---------------------------------------------------------------------------

    protected addListener(): void {
        this.config.delegatee.addEventListener(this.config.eventName, this.handler);
    }

    protected removeListener(): void {
        this.config.delegatee.removeEventListener(this.config.eventName, this.handler);
    }
}
