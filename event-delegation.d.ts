declare const EventDelegation: EventDelegation.Static;
export default EventDelegation;
export as namespace EventDelegation;

// tslint:disable:interface-name

declare namespace EventDelegation {

    interface Static {
        create<T extends HTMLElement = HTMLElement>(options: EventDelegation.Options<T>): DelegationListener;
    }

    interface DelegationListener {
        root(): HTMLElement;
        remove(): void;
    }

    interface Options<DG extends HTMLElement = HTMLElement> {
        root?: HTMLElement | string;
        selector: string;
        eventType: string;
        listener: DelegationListenerFn<DG>;
        listenerOptions?: AddEventListenerOptions;
    }

    /**
     * The listener callback to invoke whenever an event occurs. It provides 2 ways to get to the
     * delegating element -- the 'delegator':
     *
     *  - Through `this` binding
     *  - Through a property `delegator` on the event argument.
     */
    interface DelegationListenerFn<T extends HTMLElement> extends EventListener {
        (event: DelegationEvent<T>): void;
    }

    interface DelegationEvent<T extends HTMLElement> extends Event {
        delegator: T;
    }
}
