// ------------------------------------------------------------------------------
//      Common types
// ------------------------------------------------------------------------------

/**
 * The listener callback to invoke whenever an event occurs. It is provided 2 ways to get the
 * delegating element -- the 'delegator':
 *
 *  - Through `this` binding
 *  - Through a property `delegator` on the event argument.
 */
export type DelegationListener<D extends Element, E extends Event> = (this: D, event: DelegationEvent<D, E>) => void

/**
 * A delegation event the default event with an additional property `delegator` to be able to reference the
 * child element that dispatched the event within arrow function handlers.
 */
export type DelegationEvent<D extends Element, E extends Event = Event> = E & {
    delegator: D
}

/**
 * The event handler instance interface.
 */
export interface EventHandler<R extends Element> {
    isAttached(): boolean
    isDestroyed(): boolean
    root(): R
    eventType(): string
    selector(): string
    remove(): void
}

export interface DelegationConfig<R extends Element, E extends Event = Event, D extends Element = Element> {
    readonly root: R
    readonly eventType: string
    readonly selector: string
    readonly listener: DelegationListener<D, E>
    readonly listenerOptions?: boolean | AddEventListenerOptions
}

// ------------------------------------------------------------------------------
//      Creation pattern: Build methods
// ------------------------------------------------------------------------------

/**
 * Part of the global namespace `EventDelegation`. Provides methods for starting
 * initialisation of event handlers through the build methods pattern.
 */
export interface AskRoot {

    /**
     * Start building an event-delegation handler for the (global) body element.
     * Returns the next step's interface providing signatures for getting the event type.
     */
    global(): AskEvent<HTMLElement>

    /**
     * Start building an event-delegation handler for a specified root.
     *
     * Method overload that takes an Element instance as the root.
     * Returns the next step's interface providing signatures for getting the event type.
     */
    within<R extends Element>(root: R): AskEvent<R>

    /**
     * Start building an event-delegation handler for a specified root.
     *
     * Method overload that recognizes HTMLElement tag-names and infers the root type from that.
     * Returns the next step's interface providing signatures for getting the event type.
     */
    within<K extends keyof HTMLElementTagNameMap>(selector: K): AskEvent<HTMLElementTagNameMap[K]>

    /**
     * Start building an event-delegation handler for a specified root.
     *
     * Method overload that recognizes SVGElement tag-names and infers the root type from that.
     * Returns the next step's interface providing signatures for getting the event type.
     */
    within<K extends keyof SVGElementTagNameMap>(selector: K): AskEvent<SVGElementTagNameMap[K]>

    /**
     * Start building an event-delegation handler for a specified root.
     *
     * method overload that allows to explicitly specify the root type for a non-tag CSS selector.
     * Returns the next step's interface providing signatures for getting the event type.
     */
    within<R extends Element>(selector: string): AskEvent<R>
}

/**
 * Method signatures for setting the event name and getting the event type
 * for an event-delegation build process.
 */
export interface AskEvent<R extends Element> {

    /**
     * Method overload that infers the event instance type from the given event name.
     * Returns the next step's interface providing signatures for getting the event type of
     * the delegating elements.
     *
     * @param eventType
     */
    events<EKey extends keyof GlobalEventHandlersEventMap>(eventType: EKey): AskSelector<R, GlobalEventHandlersEventMap[EKey]>

    /**
     * Method overload that allows to explicitly specify the event instance type.
     * Returns the next step's interface providing signatures for getting the event type of
     * the delegating elements.
     *
     * @param eventType
     */
    events<E extends Event>(eventType: string): AskSelector<R, E>
}

/**
 * Method signatures for setting the delegator selector and getting the type of delegating elements
 * for an event-delegation build process.
 */
export interface AskSelector<R extends Element, E extends Event = Event> {

    /**
     * Method overload that recognizes HTMLElement tag-names and infers the delegator type from that.
     * Returns the final step's interface for setting the event listener function and get the event-handler instance.
     *
     * @param selector
     */
    select<K extends keyof HTMLElementTagNameMap>(selector: K): AskListener<R, E, HTMLElementTagNameMap[K]>

    /**
     * Method overload that recognizes SVGElement tag-names and infers the delegator type from that.
     * Returns the final step's interface for setting the event listener function and get the event-handler instance.
     *
     * @param selector
     */
    select<K extends keyof SVGElementTagNameMap>(selector: K): AskListener<R, E, SVGElementTagNameMap[K]>

    /**
     * Method overload that allows to explicitly specify the delegator type, which is useful for all
     * non-tag CSS selectors.
     * Returns the final step's interface for setting the event listener function and get the event-handler instance.
     *
     * @param selector
     */
    select<D extends Element>(selector: string): AskListener<R, E, D>
}

/**
 * Method signatures for the final build step: setting the event listener function for an event-delegation build process.
 */
export interface AskListener<R extends Element, E extends Event = Event, D extends Element = Element> {

    /**
     * Method signatures for the final build step: setting the event listener function for an event-delegation build process.
     * Uses the previously constructed types for delegator elements and event instances to provide full type completion
     * inside listener callbacks.
     *
     * Returns the event-handler instance.
     *
     * @param listener
     * @param listenerOptions
     */
    listen(listener: DelegationListener<D, E>, listenerOptions?: AddEventListenerOptions): EventHandler<R>
}

// ------------------------------------------------------------------------------
//      Creation pattern: create from config object
// ------------------------------------------------------------------------------

/**
 * The params object for creating an event through the
 * {@link CreateFromObject.create `EventDelegation.create()`} method.
 */
export interface CreateParams<
    D extends Element = Element,
    E extends Event = Event,
    R extends Element = Element,
    > {
    root?: R | string
    selector: string
    eventType: string
    listener: DelegationListener<D, E>
    listenerOptions?: boolean | AddEventListenerOptions
}

/**
 * Interface for the 'create from options' creation pattern.
 */
export interface CreateFromObject {
    create<
        D extends Element = Element,
        E extends Event = Event,
        R extends Element = Element,
        >(options: CreateParams<D, E, R>): EventHandler<R | HTMLElement>
}
