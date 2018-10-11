declare const EventDelegation: EventDelegation.Static;
export default EventDelegation;
export as namespace EventDelegation;

// tslint:disable:interface-name

declare namespace EventDelegation {

    interface Static {
        create(options: IOptions): EventDelegation.Subscription;
    }

    interface Subscription {
        suspend(): void;
    }

    type CssSelector = string;

    interface IOptions {

        /**
         * Optional. Can be either an HTMLElement reference or a CSS style selector for the delegatee element.
         * If not given, document.body will be used as delegatee.
         */
        delegatee?: HTMLElement | CssSelector;

        /**
         * Selector that matches against
         */
        delegatorSelector: CssSelector;

        /**
         * This would be "click", "mouseenter", etc...
         */
        eventName: string;

        /**
         *
         */
        listener: EventDelegation.Listener;
    }

    type Listener = (this: HTMLElement, event: Event) => void;
}
