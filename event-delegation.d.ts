declare const EventDelegation: EventDelegation.Static;
export default EventDelegation;
export as namespace EventDelegation;

// Todo: replace with auto-generated types
declare namespace EventDelegation {

    /**
     * The options object for an event handler instance.
     */
    interface Options<D extends HTMLElement = HTMLElement, U extends Event = Event> {
        root?: Element | string;
        selector: string;
        eventType: string;
        listener: DelegationListenerFn<D, U>;
        listenerOptions?: AddEventListenerOptions;
    }

    /**
     * The listener callback to invoke whenever an event occurs. It is provided 2 ways to get the
     * delegating element -- the 'delegator':
     *
     *  - Through `this` binding
     *  - Through a property `delegator` on the event argument.
     */
    type DelegationListenerFn<T extends HTMLElement = HTMLElement, U extends Event = Event> = (this: T, event: DelegationEvent<T, U>) => void;

    /**
     * A delegation event; the default event with an additional property `delegator` to be able to reference the
     * child element that dispatched the event within arrow function handlers.
     */
    type DelegationEvent<T extends HTMLElement = HTMLElement, U extends Event = Event> = U & {
        delegator: T;
    };

    /**
     * The static interface is currently only the `create` factory function.
     */
    interface Static {
        create<T extends HTMLElement = HTMLElement, U extends Event = Event>(options: EventDelegation.Options<T, U>): EventHandler;
    }

    /**
     * The event handler instance interface.
     */
    interface EventHandler {
        isAttached(): boolean;
        isDestroyed(): boolean;
        root(): HTMLElement;
        event(): string;
        selector(): string;
        remove(): void;
    }
}
