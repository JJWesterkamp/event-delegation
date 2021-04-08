import { ParseSelector } from 'typed-query-selector/parser';

/**
 * The listener callback to invoke whenever an event occurs. It is provided 2 ways to get the
 * delegating element -- the 'delegator':
 *
 *  - Through `this` binding
 *  - Through a property `delegator` on the event argument.
 */
export declare type DelegationListener<D extends Element, E extends Event> = (this: D, event: DelegationEvent<D, E>) => void;
/**
 * A delegation event the default event with an additional property `delegator` to be able to reference the
 * child element that dispatched the event within arrow function handlers.
 */
export declare type DelegationEvent<D extends Element, E extends Event = Event> = E & {
	delegator: D;
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
	 *
	 * Method overload that takes an Element instance as the root.
	 */
	within<R extends Element>(root: R): AskEvent<R>;
	/**
	 * Start building an event-delegation handler for a specified root.
	 *
	 * Method overload that takes a CSS tag selector for the root. This provides autocompletion
	 * features when starting to type tag-qualified CSS selectors.
	 */
	within<K extends keyof TagNameMap>(selector: K): AskEvent<TagNameMap[K]>;
	/**
	 * Start building an event-delegation handler for a specified root.
	 *
	 * Method overload that takes a CSS selector for the root. It wil attempt to parse the selector
	 * and infer the root element type from it.
	 */
	within<S extends string>(selector: S): AskEvent<ParseSelector<S>> | never;
	/**
	 * Start building an event-delegation handler for a specified root.
	 *
	 * Method overload that can be used when all else fails. If previous overloads
	 * failed to match, this one allows you to explicitly specify the expected root
	 * type for _any_ selector string.
	 *
	 * @param root
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
	 * @param eventType
	 */
	events<EKey extends keyof EventMap>(eventType: EKey): AskSelector<R, EventMap[EKey]>;
	/**
	 * Method overload that allows to explicitly specify the event instance type.
	 * Returns the next step's interface providing signatures for getting the event type of
	 * the delegating elements.
	 *
	 * @param eventType
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
	 */
	select<K extends keyof TagNameMap>(selector: K): AskListener<R, E, TagNameMap[K]>;
	/**
	 * Takes the delegation selector.
	 *
	 * The method wil attempt to parse the selector and infer the root element type from it.
	 */
	select<S extends string>(selector: S): AskListener<R, E, ParseSelector<S>>;
	/**
	 * Takes the delegation selector.
	 *
	 * Method overload that can be used when all else fails. If previous overloads
	 * failed to match, this one allows you to explicitly specify the expected element
	 * type for _any_ selector string.
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
	listen(listener: DelegationListener<D, E>, listenerOptions?: AddEventListenerOptions): EventHandler<R>;
}
declare const EventDelegation: AskRoot;
export default EventDelegation;

export as namespace EventDelegation;

export {};
