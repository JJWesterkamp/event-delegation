import { IDelegationConfig } from "./private-interface";
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

    constructor(protected config: IDelegationConfig) {
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
            );

            if (delegator) {
                this.config.listener.call(delegator, this.proxyEvent(event, delegator));
            }
        };
    }

    protected proxyEvent(event: Event, delegator: HTMLElement): Event {
        // Todo: Find a way to proxy the event in order to return delegator
        // when event.currentTarget is accessed.
        return event;
    }

    // ---------------------------------------------------------------------------
    // Adding / removing the listener
    // ---------------------------------------------------------------------------

    protected addListener(): void {

        if (this.isAttached || this.isDestroyed) {
            return;
        }

        this.config.currentTarget.addEventListener(this.config.event, this.handler, this.config.listenerOptions);
        this.isAttached = true;
    }

    protected removeListener(): void {
        this.config.currentTarget.removeEventListener(this.config.event, this.handler);
    }
}
