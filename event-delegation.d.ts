declare const EventDelegation: EventDelegation.Static;
export default EventDelegation;
export as namespace EventDelegation;

declare namespace EventDelegation {

    interface Static {
        delegate(options: DelegationOptions): EventDelegation.Subscription;
    }

    interface Subscription {
        type(): string;
        suspend(): boolean;
    }

    interface DelegationOptions {
        delegatee: HTMLElement;
        delegatorSelector: string;
        eventName: string;
        listener: EventDelegation.Listener;
    }

    interface Listener {
        (this: HTMLElement, event: Event): void;
    }
}
