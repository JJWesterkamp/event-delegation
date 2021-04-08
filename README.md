# event-delegation

Event delegation for browser DOM events. Flexible, cross-browser compatible and Type-focused.

[![npm version](https://badge.fury.io/js/%40jjwesterkamp%2Fevent-delegation.svg)](https://badge.fury.io/js/%40jjwesterkamp%2Fevent-delegation)
[![Build Status](https://travis-ci.com/JJWesterkamp/event-delegation.svg?branch=master)](https://travis-ci.com/JJWesterkamp/event-delegation)
[![Coverage Status](https://coveralls.io/repos/github/JJWesterkamp/event-delegation/badge.svg?branch=master#)](https://coveralls.io/github/JJWesterkamp/event-delegation?branch=master)

![event-delegation-2](https://user-images.githubusercontent.com/12270687/113784833-5b41d000-9736-11eb-8bb9-1f5a894dcc12.gif)

> Note: this package is currently under heavy development, and this README does not reflect the latest
> published version. See tag [0.4.4](https://github.com/JJWesterkamp/event-delegation/tree/v0.4.4) for
> the current version.

## Installation

**CDN**

```html
<script src="https://cdn.jsdelivr.net/npm/@jjwesterkamp/event-delegation/umd/event-delegation.min.js"></script>
```

**npm**

```
$ npm install @jjwesterkamp/event-delegation --save
```

## Usage

```typescript
import EventDelegation from '@jjwesterkamp/event-delegation'
```

There are two main functions on the EventDelegation namespace object:

- `EventDelegation.global()`
- `EventDelegation.within(root)`

Both methods are used to start an event listener through the same kind of builder-pattern.
The `global()` method is used to attach a global listener on the top-level `document.body` element.
The `within()` method is used to provide an alternative root element for the listener.

The build process has the following 4 steps in the following order, ultimately returning an `EventHandler` instance:

[`AskRoot`][AskRoot] => [`AskEvent`][AskEvent] => [`AskSelector`][AskSelector] => [`AskListener`][AskListener] => [`EventHandler`][EventHandler]
> First, ask for a root, then an event name, then a descendant selector, and finally a listener callback.
### EventDelegation.global()
```typescript
// Pseudo
EventDelegation.global(): AskEvent<HTMLElement>
```

The following examples use the `global()` method that attaches an event listener to `document.body` -- globally.
The returned builder ultimately creates an `EventHandler<HTMLElement>` where `HTMLElement` is the type of the root `document.body`.

```typescript
const handler = EventDelegation
    .global()
    .events('click')
    .select('button')
    .listen(function(event) {
        this.classList.add('button--clicked')
    })
```
Inside the event listener callback, `this` is the element that matched `"button"`. In order for _this-binding_ to work, `listener` must be a
regular function. For cases where arrow functions are preferred, the event argument provides an additional property `delegator`
as an alternative:

```javascript
EventDelegation
    // ...
    .listen((event) => event.delegator.classList.add('button--clicked'))
```

This builder pattern is convenient because it allows for automatic type completion of practically all required type information.
Each of the above steps are represented by interfaces with multiple overloads. Methods that take CSS selectors will attempt 
to parse the selectors and infer the element type from them. The inferred types are then automatically
known in the listener callback provided in the `.listen()` step.

In the above example the event type is automatically identified as `MouseEvent`, and `event.delegator` (or `this`) is
identified as `HTMLButtonElement`.


Thanks to the **great** package [typed-query-selector](https://github.com/g-plane/typed-query-selector) you can even supply
complex CSS selectors and the type will automatically be inferred if the selectors are **tag-qualified** and **valid**.
Even grouping selectors are supported, hence in the example below `event.delegator` is the union type
`HTMLButtonElement | HTMLInputElement`:

```typescript
EventDelegation
    .global()
    .events('click')
    .select('#my-div > button.submit, fieldset input.submit')
    .listen((event) => { /* ... */ })

// event is DelegationEvent<HTMLButtonElement | HTMLInputElement, MouseEvent>
```

The element types will default to `Element` for CSS selectors that are not tag-qualified or are invalid:

```typescript
EventDelegation
    .global()
    .events('click')
    .select('#my-div > .submit, fieldset iput.submit')
    //       ^^^^^^^^^^^^^^^^^
    //       not tag-qualified
    //                          ^^^^^^^^^^^^^^^^^^^^
    //                          invalid (iput)
    .listen((event) => { /* ... */ })

// event is DelegationEvent<Element, MouseEvent>
```

### EventDelegation.within()
```typescript
// Pseudo
EventDelegation.within(root: Element | string): AskEvent<T>
```

Alternatively you can add event listeners to other elements with the `within`method. It takes either an element or a selector. In the case of an element its type is preserved and ultimately
an `EventHandler<R>` is returned:

```typescript
declare const myRoot: HTMLFormElement

// EventHandler<HTMLFormElement>
const handler = EventDelegation
    .within(myRoot)
    .events('click')
    .select('button')
    .listen((event) => { /* ... */ })
```

In the case of a selector the type is inferred from the given string just as with the `.select()` method:

```typescript
const handler = EventDelegation
    .within('form#my-form')
    .events('click')
    .select('button')
    .listen((event) => { /* ... */ })

// handler is EventHandler<HTMLFormElement>
```

⚠️ `within()` will throw an error if no root was found or if the selector is invalid.

### A note about roots

If the `root` is a selector, `within()` will create one single handler for the **first matching element**.

> ⚠️ Unlike some other event delegation packages, this package does not create multiple listeners for all matching
> elements when the `root` is a selector. This is a design decision because such elements could be nested within
> each other, resulting in very unpredictable behavior, including 'duplicated' handling of events that bubble through
> multiple matching roots, and inconsistencies based on whether events' `stopPropagation` methods have been called.
>
> You could of course still map a list of elements to event-handlers yourself to circumvent this 'drawback'.

### EventHandler

All creation methods return an EventHandler instance, which has the following shape:

```typescript
interface EventHandler<R extends Element> {
    isAttached(): boolean
    isDestroyed(): boolean
    root(): R
    eventType(): string
    selector(): string
    remove(): void
}
```

The event handler instance exists primarily to later remove the listener:

```typescript
handler.remove()
```

It additionally has some methods that might be useful, among which `selector()`, `eventType()` and `root()`
providing the input parameters of creation.

`isAttached()` will tell whether the listener is active. It'll always return `true` until the listener is removed.

`isDestroyed()` is the opposite of `isAttached()`, and returns `false` until the listener is removed.

### Selector matching failure / custom selectors

Methods that take CSS-style selectors might fail to successfully infer an element type for them at some point. 
It might be an error in the selector syntax itself, but might also be a bug in this package. Another case where 
the default selector matching fails are selectors custom web components. For all such cases all methods that take 
selectors have one final signature overload as a last resort to not ruin your day. They take an explicit type argument 
for the element type, and _any_ string as their selector argument:

```typescript
const handler = EventDelegation
    .within<CustomComponent>('custom-component')
    .events('click')
    .select<CustomButton>('custom-button')
    .listen((event) => { console.log(event.foo) })

// event is DelegationEvent<CustomButton, MouseEvent>
// handler is EventHandler<CustomComponent>
```

### Using custom events

When using custom events the event types will by default be considered the base type `Event`. You can
however append definitions for your custom events to the `GlobalEventHandlersEventMap`:

```typescript
declare global {
    interface GlobalEventHandlersEventMap {
        'my:event': Event & { foo: string }
    }
}

EventDelegation
    .global()
    .events('my:event')
    .select('td')
    .listen((event) => { console.log(event.foo) })

// event is DelegationEvent<HTMLTableDataCellElement, Event & {foo: string}>
```

### Working in Javascript - a few limitations

When working in Javascript you can't provide explicit type arguments for function calls. Most typescript-savvy editors 
will still give (near) perfect type completion for all cases where the types are
inferred, such as when using tag selectors and standard event names such as `'click'`. This is also true when passing
existing element references if they have the correct type in advance.

In case of non-recognised CSS selectors element types will most of the time default to `Element`. In the example below
`x` will probably be considered an `Element`, as well as `e.delegator`:

```javascript
const handler = EventDelegation
    .within('custom-component')
    .events('click')
    .select('custom-button')
    .listen((e) => { /* ... */ })

const x = handler.root()
```

## License

The MIT License (MIT). See [license file] for more information.

[license file]: https://github.com/JJWesterkamp/event-delegation/blob/master/LICENSE
[AskRoot]: https://jjwesterkamp.github.io/event-delegation/interfaces/types.askroot.html
[AskEvent]: https://jjwesterkamp.github.io/event-delegation/interfaces/types.askevent.html
[AskSelector]: https://jjwesterkamp.github.io/event-delegation/interfaces/types.askselector.html
[AskListener]: https://jjwesterkamp.github.io/event-delegation/interfaces/types.asklistener.html
[EventHandler]: https://jjwesterkamp.github.io/event-delegation/interfaces/types.eventhandler.html
[mdn-event-listener-options]: https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
