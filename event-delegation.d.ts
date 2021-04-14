import type { ParseSelector } from 'typed-query-selector/parser'

/**
 * The listener callback to invoke whenever an event occurs. It is provided 2 ways to get the
 * delegating element -- the 'delegator':
 *
 *  - Through `this` binding
 *  - Through the property {@link DelegationEvent.delegator `delegator`} on the event argument.
 *
 * @typeParam D The element type for the delegation selector
 * @typeParam E The event instance type
 * @typeParam R The type of the root element (or `event.currentTarget`)
 */
export type DelegationListener<
    D extends Element,
    E extends Event,
    R extends Element
    > = (this: D, event: DelegationEvent<D, E, R>) => void

/**
 * A delegation event. The inferred event instance type with an additional property `delegator` referencing the
 * descendant element that matched the delegation selector.
 *
 * @typeParam D The element type for the delegation selector
 * @typeParam E The event instance type
 * @typeParam R The type of the root element (or `event.currentTarget`)
 */
export type DelegationEvent<D extends Element, E extends Event, R extends Element> = E & {
    readonly delegator: D
    readonly currentTarget: R
}

/**
 * The event handler instance interface.
 *
 * {@link AskRoot `AskRoot`} => {@link AskEvent `AskEvent`} => {@link AskSelector `AskSelector`} => {@link AskListener `AskListener`} builds **`EventHandler`**
 *
 * @typeParam R The type of the root element to which the event listener is attached.
 */
export interface EventHandler<R extends Element> {
    /** Tells whether this handler is currently attached, ie. the listener is active. */
    isAttached(): boolean
    /** Tells whether the listener for this instance has been removed previously. */
    isDestroyed(): boolean
    /** Returns the root element - the element to which the event listener is attached. */
    root(): R
    /** Tells what events this instance is listening for. */
    eventType(): string
    /** Returns the CSS selector that is used to match against descendant elements. */
    selector(): string
    /** Removes the event listener for this instance. */
    remove(): void
}

/**
 * Internally used configuration type for EventHandler construction.
 */
export interface DelegationConfig<R extends Element, E extends Event = Event, D extends Element = Element> {
    readonly root: R
    readonly eventType: string
    readonly selector: string
    readonly listener: DelegationListener<D, E, R>
    readonly listenerOptions?: boolean | AddEventListenerOptions
}

export type TagNameMap = HTMLElementTagNameMap & SVGElementTagNameMap
export type EventMap   = GlobalEventHandlersEventMap
export type BuildMode  = 'SINGLE' | 'MANY'

export type Build<M extends BuildMode, R extends Element> = M extends 'MANY' ? EventHandler<R>[] :
                                                            M extends 'SINGLE' ? EventHandler<R> :
                                                            never

/**
 * Represents the package's main namespace `EventDelegation`. Provides methods for setting the
 * event-delegation root element(s)
 *
 * **`AskRoot`** => {@link AskEvent `AskEvent`} => {@link AskSelector `AskSelector`} => {@link AskListener `AskListener`} builds {@link EventHandler `EventHandler`}
 * > All methods / overloads return the {@link AskEvent `AskEvent`} interface.
 */
export interface AskRoot {

    // ------------------------------------------------------------------------------
    //      EventDelegation.global()
    // ------------------------------------------------------------------------------

    /**
     * Start building an event-delegation handler for the (global) body element.
     *
     * @example
     * ```typescript
     * EventDelegation
     *     .global()
     * ```
     */
    global(): AskEvent<HTMLElement, 'SINGLE'>

    // ------------------------------------------------------------------------------
    //      EventDelegation.within()
    // ------------------------------------------------------------------------------

    /**
     * Start building an event-delegation handler for a specified root.
     *
     * Method overload that takes an Element instance as the root.
     *
     * @param root A root element reference.
     * @typeParam R The element type for the root element.
     *              This param is inferred from the selector argument.
     *
     * @example
     * ```typescript
     * declare const myRoot: HTMLElement
     *
     * EventDelegation
     *     .within(myRoot)
     * ```
     */
    within<R extends Element>(root: R): AskEvent<R, 'SINGLE'>

    /**
     * Start building an event-delegation handler for a specified root.
     *
     * Method overload that takes a CSS tag selector for the root. This provides autocompletion
     * features when starting to type tag-qualified CSS selectors.
     *
     * @param selector An HTML (or SVG) tag selector.
     * @typeParam K the HTML tag name literal type for the selector argument.
     *              This param is inferred from the selector argument.
     *
     * @example
     * ```typescript
     * EventDelegation
     *     .within('form')
     * ```
     */
    within<K extends keyof TagNameMap>(selector: K): AskEvent<TagNameMap[K], 'SINGLE'> | never

    /**
     * Start building an event-delegation handler for a specified root.
     *
     * Method overload that takes a CSS selector for the root. It wil attempt to parse the selector
     * and infer the root element type from it.
     *
     * @param selector A tag-qualified CSS-style selector to parse.
     * @typeParam S The CSS-style selector literal type for the selector argument.
     *              This param is inferred from the selector argument.
     *
     * @example
     * ```typescript
     * EventDelegation
     *     .within('#main form.my-form')
     * ```
     */
    within<S extends string>(selector: S): AskEvent<ParseSelector<S>, 'SINGLE'> | never

    /**
     * Start building an event-delegation handler for a specified root.
     *
     * Method overload that can be used when all else fails. If previous overloads
     * failed to match, this one allows you to explicitly specify the expected root
     * type for _any_ selector string.
     *
     * @param root Any CSS selector that is expected to select the root element type.
     * @typeParam R The element type for the root element.
     *              This param can be explicitly given to override the default `Element` type.
     *
     * @example
     * ```typescript
     * EventDelegation
     *     .within<CustomComponent>('custom-component')
     * ```
     */
    within<R extends Element>(root: string): AskEvent<R, 'SINGLE'> | never

    // ------------------------------------------------------------------------------
    //      EventDelegation.withinMany()
    // ------------------------------------------------------------------------------

    /**
     * Start building an event-delegation handler for multiple specified roots.
     *
     * Method overload that takes Element instances as the roots.
     *
     * @param roots An array of root element references.
     * @typeParam R The element type for the root elements. Note that this may very well be a union type
     *              when an array with multiple root types is given. This param is inferred from the selector
     *              argument.
     *
     * @example
     * ```typescript
     * declare const rootA: HTMLElement
     * declare const rootB: HTMLFormElement
     *
     * EventDelegation
     *     .withinMany([rootA, rootB])
     * ```
     */
    withinMany<R extends Element>(roots: R[]): AskEvent<R, 'MANY'>

    /**
     * Start building an event-delegation handler for multiple specified roots.
     *
     * Method overload that takes a CSS tag selector for the roots. This provides autocompletion
     * features when starting to type tag-qualified CSS selectors.
     *
     * @param selector An HTML (or SVG) tag selector.
     * @typeParam K the HTML tag name literal type for the selector argument.
     *              This param is inferred from the selector argument.
     *
     * @example
     * ```typescript
     * EventDelegation
     *     .withinMany('form')
     * ```
     */
    withinMany<K extends keyof TagNameMap>(selector: K): AskEvent<TagNameMap[K], 'MANY'>

    /**
     * Start building an event-delegation handler for multiple specified roots.
     *
     * Method overload that takes a CSS selector for the roots. It wil attempt to parse the selector
     * and infer the root elements' type from it.
     *
     * @param selector A tag-qualified CSS-style selector to parse.
     * @typeParam S The CSS-style selector literal type for the selector argument.
     *              This param is inferred from the selector argument.
     *
     * @example
     * ```typescript
     * EventDelegation
     *     .withinMany('#main form.my-form')
     * ```
     */
    withinMany<S extends string>(selector: S): AskEvent<ParseSelector<S>, 'MANY'>

    /**
     * Start building an event-delegation handler for multiple specified roots.
     *
     * Method overload that can be used when all else fails. If previous overloads
     * failed to match, this one allows you to explicitly specify the expected
     * type for _any_ selector string.
     *
     * @param root Any CSS selector that is expected to select the root element type.
     * @typeParam R The element type for the root element.
     *              This param can be explicitly given to override the default `Element` type.
     *
     * @example
     * ```typescript
     * EventDelegation
     *     .withinMany<CustomComponent>('custom-component')
     * ```
     */
    withinMany<R extends Element>(roots: string): AskEvent<R, 'MANY'>
}

/**
 * Method signatures that set the event name and instance type.
 *
 * {@link AskRoot `AskRoot`} => **`AskEvent`** => {@link AskSelector `AskSelector`} => {@link AskListener `AskListener`} builds {@link EventHandler `EventHandler`}
 * > All overloads return the {@link AskSelector `AskSelector`} interface.
 */
export interface AskEvent<R extends Element, Mode extends BuildMode> {

    /**
     * Method overload that infers the event instance type from the given event name.
     *
     * @param eventType The event name of events to listen to.
     * @typeParam EKey The event name literal type that's used to infer the Event instance type.
     *            This param is inferred from the `eventType` argument.
     *
     * @example
     * ```typescript
     * EventDelegation
     *     .global()
     *     .events('click')
     * ```
     */
    events<EKey extends keyof EventMap>(eventType: EKey): AskSelector<R, EventMap[EKey], Mode>

    /**
     * Method overload that allows to explicitly specify the event instance type.
     *
     * @param eventType The event name of events to listen to.
     * @typeParam E The Event instance type. This param can be explicitly given to override
     *              the default `Event` type.
     *
     * @example
     * ```typescript
     * EventDelegation
     *     .global()
     *     .events<CustomEvent>('my:event')
     * ```
     */
    events<E extends Event>(eventType: string): AskSelector<R, E, Mode>
}

/**
 * Method signatures that set the delegator selector and instance type of delegating elements.
 *
 * {@link AskRoot `AskRoot`} => {@link AskEvent `AskEvent`} => **`AskSelector`** => {@link AskListener `AskListener`} builds {@link EventHandler `EventHandler`}
 * > All overloads return the {@link AskListener `AskListener`} interface
 */
export interface AskSelector<R extends Element, E extends Event, Mode extends BuildMode> {

    /**
     * Takes the delegation selector.
     *
     * Method overload that takes a CSS tag selector for the delegator elements. This provides autocompletion
     * features when starting to type tag-qualified CSS selectors.
     *
     * @param selector An HTML (or SVG) tag selector.
     * @typeParam K the HTML tag name literal type for the selector argument.
     *              This param is inferred from the selector argument.
     *
     * @example
     * ```typescript
     * EventDelegation
     *     .global()
     *     .events('click')
     *     .select('button')
     * ```
     */
    select<K extends keyof TagNameMap>(selector: K): AskListener<R, E, TagNameMap[K], Mode>

    /**
     * Takes the delegation selector.
     *
     * The method wil attempt to parse the selector and infer the root element type from it.
     *
     * @param selector A tag-qualified CSS-style selector to parse.
     * @typeParam S The CSS-style selector literal type for the selector argument.
     *              This param is inferred from the selector argument.
     *
     * @example
     * ```typescript
     * EventDelegation
     *     .global()
     *     .events('click')
     *     .select('form button.my-button[aria-disabled="false"]')
     * ```
     */
    select<S extends string>(selector: S): AskListener<R, E, ParseSelector<S>, Mode>

    /**
     * Takes the delegation selector.
     *
     * Method overload that can be used when all else fails. If previous overloads
     * failed to match, this one allows you to explicitly specify the expected element
     * type for _any_ selector string.
     *
     * @param selector Any CSS selector that is expected to select the delegator element type.
     * @typeParam D The element type for the delegator elements.
     *              This param can be explicitly given to override the default `Element` type.
     *
     * @example
     * ```typescript
     * EventDelegation
     *     .global()
     *     .events('click')
     *     .select<CustomButton>('custom-button')
     * ```
     */
    select<D extends Element>(selector: string): AskListener<R, E, D, Mode>
}

/**
 * Method signatures that set the event listener function and return event handlers.
 *
 * {@link AskRoot `AskRoot`} => {@link AskEvent `AskEvent`} => {@link AskSelector `AskSelector`} => **`AskListener`** builds {@link EventHandler `EventHandler`}
 * > Returns one or many {@link EventHandler `EventHandler`} instances.
 */
export interface AskListener<R extends Element, E extends Event, D extends Element, Mode extends BuildMode> {

    /**
     * Takes the event listener function. Uses the previously constructed types for delegator elements
     * and event instances to provide full type inference inside listener callbacks.
     *
     * returns one {@link EventHandler `EventHandler`} instance when the build started with either
     * {@link AskRoot.global `global()`} or {@link AskRoot.within `within()`},
     * or an array of EventHandler instances when the build started with
     * {@link AskRoot.withinMany `withinMany()`}.
     *
     * @param listener
     * @param listenerOptions
     * @example
     * ```typescript
     * // Returns either one handler
     * const oneHandler: EventHandler<HTMLElement> = EventDelegation
     *     .global()
     *     .events('click')
     *     .select('button')
     *     .listen((e) => e.delegator.disabled = true)
     *
     * // or many handlers
     * const manyHandlers: EventHandler<HTMLFormElement>[] = EventDelegation
     *     .withinMany('form')
     *     .events('click')
     *     .select('button')
     *     .listen((e) => e.delegator.disabled = true)
     * ```
     */
    listen(listener: DelegationListener<D, E, R>, listenerOptions?: boolean | AddEventListenerOptions): Build<Mode, R>
}

declare const EventDelegation: AskRoot
export default EventDelegation
export as namespace EventDelegation
