declare const EventDelegation: EventDelegation.Static;
export default EventDelegation;
export as namespace EventDelegation;

// tslint:disable:interface-name

declare namespace EventDelegation {

    interface Static {
        delegate(options: DelegationOptions): EventDelegation.Subscription;
    }

    interface Subscription {
        suspend(): void;
    }

    type CssSelector = string;

    interface DelegationOptions {

        /**
         * Optional. Can be either an HTMLElement reference or a CSS style selector for the delegatee element.
         * If not given, document.body will be used as delegatee.
         */
        delegatee?: HTMLElement | CssSelector;

        /**
         * Selector that matches against
         */
        delegatorSelector: CssSelector;
        eventName: string;
        listener: EventDelegation.Listener;
    }

    type Listener = (this: HTMLElement, event: Event) => void;
}
