declare const EventDelegation: EventDelegation.Static;
export default EventDelegation;
export as namespace EventDelegation;

declare namespace EventDelegation {

    interface Static {
        // ...
    }

    /**
     * Alias for the HTML element that is the container the event-handling is delegated to.
     */
    type Delegatee = Element;

    /**
     * Alias for one of probably multiple elements that match the delegator selector.
     */
    type Delegator = Element;

    /**
     * Alias for event target elements.
     */
    type EventTarget = Element;
}
