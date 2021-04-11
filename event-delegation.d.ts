import { ParseSelector } from 'typed-query-selector/parser';

/**
 * The listener callback to invoke whenever an event occurs. It is provided 2 ways to get the
 * delegating element -- the 'delegator':
 *
 *  - Through `this` binding
 *  - Through a property `delegator` on the event argument.
 *
 * @typeParam D The element type for the delegation selector
 * @typeParam E The event instance type
 * @typeParam R The type of the root element (or `event.currentTarget`)
 */
export declare type DelegationListener<D extends Element, E extends Event, R extends Element> = (this: D, event: DelegationEvent<D, E, R>) => void;
/**
 * A delegation event the default event with an additional property `delegator` to be able to reference the
 * child element that dispatched the event within arrow function handlers.
 *
 * @typeParam D The element type for the delegation selector
 * @typeParam E The event instance type
 * @typeParam R The type of the root element (or `event.currentTarget`)
 */
export declare type DelegationEvent<D extends Element, E extends Event, R extends Element> = E & {
	readonly delegator: D;
	readonly currentTarget: R;
};
/**
 * The event handler instance interface.
 */
export interface EventHandler<R extends Element> {
	isAttached(): boolean;
	isDestroyed(): boolean;
	root(): R;
	eventType(): string;
	selector(): string;
	remove(): void;
}
export declare type TagNameMap = HTMLElementTagNameMap & SVGElementTagNameMap;
export declare type EventMap = GlobalEventHandlersEventMap;
/**
 * Part of the package namespace `EventDelegation`. Provides methods for starting
 * initialisation of event handlers through the build methods pattern. All methods
 * Return the next step's interface providing signatures for getting the event type.
 */
export interface AskRoot {
	/**
	 * Start building an event-delegation handler for the (global) body element.
	 */
	global(): AskEvent<HTMLElement>;
	/**
	 * Start building an event-delegation handler for a specified root.
	 * Method overload that takes an Element instance as the root.
	 *
	 * @param root A root element reference.
	 * @typeParam R The element type for the root element.
	 *              This param is inferred from the selector argument.
	 */
	within<R extends Element>(root: R): AskEvent<R>;
	/**
	 * Start building an event-delegation handler for a specified root.
	 *
	 * Method overload that takes a CSS tag selector for the root. This provides autocompletion
	 * features when starting to type tag-qualified CSS selectors.
	 *
	 * @param selector An HTML (or SVG) tag selector.
	 * @typeParam K the HTML tag name literal type for the selector argument.
	 *              This param is inferred from the selector argument.
	 */
	within<K extends keyof TagNameMap>(selector: K): AskEvent<TagNameMap[K]>;
	/**
	 * Start building an event-delegation handler for a specified root.
	 *
	 * Method overload that takes a CSS selector for the root. It wil attempt to parse the selector
	 * and infer the root element type from it.
	 *
	 * @param selector A tag-qualified CSS-style selector to parse.
	 * @typeParam S The CSS-style selector literal type for the selector argument.
	 *              This param is inferred from the selector argument.
	 */
	within<S extends string>(selector: S): AskEvent<ParseSelector<S>> | never;
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
	 */
	within<R extends Element>(root: string): AskEvent<R>;
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
	 * @param eventType The event name of events to listen to.
	 * @typeParam EKey The event name literal type that's used to infer the Event instance type.
	 *            This param is inferred from the `eventType` argument.
	 */
	events<EKey extends keyof EventMap>(eventType: EKey): AskSelector<R, EventMap[EKey]>;
	/**
	 * Method overload that allows to explicitly specify the event instance type.
	 * Returns the next step's interface providing signatures for getting the event type of
	 * the delegating elements.
	 *
	 * @param eventType The event name of events to listen to.
	 * @typeParam E The Event instance type. This param can be explicitly given to override
	 *              the default `Event` type.
	 */
	events<E extends Event>(eventType: string): AskSelector<R, E>;
}
/**
 * Method signatures for setting the delegator selector and getting the type of delegating elements
 * for an event-delegation build process. All overloads Return the final step's interface for setting
 * the event listener function and get the event-handler instance.
 */
export interface AskSelector<R extends Element, E extends Event = Event> {
	/**
	 * Takes the delegation selector.
	 *
	 * Method overload that takes a CSS tag selector for the delegator elements. This provides autocompletion
	 * features when starting to type tag-qualified CSS selectors.
	 *
	 * @param selector An HTML (or SVG) tag selector.
	 * @typeParam K the HTML tag name literal type for the selector argument.
	 *              This param is inferred from the selector argument.
	 */
	select<K extends keyof TagNameMap>(selector: K): AskListener<R, E, TagNameMap[K]>;
	/**
	 * Takes the delegation selector.
	 *
	 * The method wil attempt to parse the selector and infer the root element type from it.
	 *
	 * @param selector A tag-qualified CSS-style selector to parse.
	 * @typeParam S The CSS-style selector literal type for the selector argument.
	 *              This param is inferred from the selector argument.
	 */
	select<S extends string>(selector: S): AskListener<R, E, ParseSelector<S>>;
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
	 */
	select<D extends Element>(selector: string): AskListener<R, E, D>;
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
	listen(listener: DelegationListener<D, E, R>, listenerOptions?: AddEventListenerOptions): EventHandler<R>;
}
declare const EventDelegation: AskRoot;
export default EventDelegation;

export as namespace EventDelegation;

export {};
