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
    event(): string
    selector(): string
    remove(): void
}

export interface DelegationConfig<R extends Element, E extends Event = Event, D extends Element = Element> {
    readonly root: R
    readonly eventType: string
    readonly selector: string
    readonly listener: DelegationListener<D, E>
    readonly listenerOptions?: AddEventListenerOptions
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
    listenerOptions?: AddEventListenerOptions
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

// ------------------------------------------------------------------------------
//      Creation pattern: Build methods
// ------------------------------------------------------------------------------

export interface AskRoot {
    within<R extends Element>(rootOrSelector: R | string): AskEvent<R>
    global(): AskEvent<HTMLElement>
}

export interface AskEvent<R extends Element> {
    events<EKey extends keyof WindowEventMap>(event: EKey): AskSelector<R, WindowEventMap[EKey]>
    events(eventType: string): AskSelector<R>
}

export interface AskSelector<R extends Element, E extends Event = Event> {
    select<K extends keyof HTMLElementTagNameMap>(selector: K): AskListener<R, E, HTMLElementTagNameMap[K]>
    select<K extends keyof SVGElementTagNameMap>(selector: K): AskListener<R, E, SVGElementTagNameMap[K]>
    select<D extends Element>(selector: string): AskListener<R, E, D>
}

export interface AskListener<R extends Element, E extends Event = Event, D extends Element = Element> {
    listen(listener: DelegationListener<D, E>, listenerOptions?: AddEventListenerOptions): EventHandler<R>
}
