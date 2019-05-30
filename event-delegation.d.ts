declare const EventDelegation: EventDelegation.Static;
export default EventDelegation;
export as namespace EventDelegation;

// tslint:disable:interface-name

declare namespace EventDelegation {

    interface Options<DG extends HTMLElement = HTMLElement> {
        root?: HTMLElement | string;
        selector: string;
        eventType: string;
        listener: DelegationListenerFn<DG>;
        listenerOptions?: AddEventListenerOptions;
    }

    /**
     * The listener callback to invoke whenever an event occurs. It is provided 2 ways to get the
     * delegating element -- the 'delegator':
     *
     *  - Through `this` binding
     *  - Through a property `delegator` on the event argument.
     */
    type DelegationListenerFn<DG extends HTMLElement = HTMLElement> = (this: DG, event: DelegationEvent<DG>) => void;

    interface DelegationEvent<DG extends HTMLElement = HTMLElement> extends Event {
        delegator: DG;
    }

    interface Static {
        create<DG extends HTMLElement = HTMLElement>(options: EventDelegation.Options<DG>): EventHandler;
    }

    interface EventHandler {
        isAttached(): boolean;
        isDestroyed(): boolean;
        root(): HTMLElement;
        event(): string;
        selector(): string;
        remove(): void;
    }

    interface EventHandlerCollection {
        count(): number;
        roots(): HTMLElement[];
        events(): string[];
        removeAll(): void;
        handlers(): EventHandler[];
        filter(transformer: (handler: EventHandler) => boolean): EventHandlerCollection;
        map<T>(transformer: (handler: EventHandler) => T): T[];
        pickByEvent(event: string): EventHandlerCollection;
        pickByRoot(root: HTMLElement): EventHandlerCollection;
        pickByDelegator(selector: string): EventHandlerCollection;
    }
}
