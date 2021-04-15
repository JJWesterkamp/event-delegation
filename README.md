

# event-delegation

Event delegation for browser DOM events. Flexible, cross-browser compatible and Typescript-focused.

[![npm version](https://badgen.net/npm/v/@jjwesterkamp/event-delegation?label=npm%20package&color=green&cache=600)][npm]
[![Build Status](https://travis-ci.com/JJWesterkamp/event-delegation.svg?branch=master)](https://travis-ci.com/JJWesterkamp/event-delegation)
[![Coverage Status](https://coveralls.io/repos/github/JJWesterkamp/event-delegation/badge.svg?branch=master#1)](https://coveralls.io/github/JJWesterkamp/event-delegation?branch=master)

<br>

![carbon](https://user-images.githubusercontent.com/12270687/114447455-b9f1c880-9bd2-11eb-9222-c5f5be14655c.png)

> Featuring full type inference of the event type, the delegating descendants and the event's currentTarget.

## Quick links

- [npm]
- [jsDelivr][cdn]
- [Github][gh]
- [Changelog]
- [API documentation][docs]

## Installation

### npm

![npm module size](https://badgen.net/bundlephobia/minzip/@jjwesterkamp/event-delegation?label=module%20size%20-%20gzipped&color=cyan&cache=600)

Install the package with npm, and then import the default export:

```text
$ npm install @jjwesterkamp/event-delegation --save
```

```typescript
import EventDelegation from '@jjwesterkamp/event-delegation'
```

### CDN
[![UMD bundle size](https://badgen.net/badgesize/gzip/file-url/https/cdn.jsdelivr.net/npm/@jjwesterkamp/event-delegation/umd/event-delegation.min.js?color=cyan&label=download%20size%20-%20gzipped&cache=600)][cdn-min]

UMD bundles are also included in the npm package, you can load them from any CDN that lists npm packages. For example:

```html
<script src="//cdn.jsdelivr.net/npm/@jjwesterkamp/event-delegation/umd/event-delegation.min.js"></script>
```

## Usage

There are three main functions on the EventDelegation namespace object. All methods are used to start an event listener
through the same kind of builder-pattern.

1. [`EventDelegation.global()`](#eventdelegationglobal)

    The `global()` method is used to attach a global listener on the top-level `document.body` element.

2. [`EventDelegation.within(root)`](#eventdelegationwithin)

    The `within()` method is used to provide one alternative root element for the listener.

3. [`EventDelegation.withinMany(roots)`](#eventdelegationwithinmany)

    The `withinMany()` method is used to provide multiple alternative roots for creating many listeners at once.

---

The build process has the following 4 steps in the following order, ultimately returning one single or multiple
`EventHandler` instances, depending on the called method:

[`AskRoot`][AskRoot] => [`AskEvent`][AskEvent] => [`AskSelector`][AskSelector] => [`AskListener`][AskListener] => [`EventHandler`][EventHandler]
> First, ask for a root, then an event name, then a descendant selector, and finally a listener callback.

### EventDelegation.global()

```typescript
// Pseudo
EventDelegation.global(): AskEvent
```

The following examples use the `global()` method that attaches an event listener globally to `document.body`.
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

**Listener callbacks**

Inside the event listener callback, `this` is the element that matched `"button"`. In order for _this-binding_ to work, `listener` must be a
regular function. For cases where arrow functions are preferred, the event argument provides an additional property `delegator`
as an alternative:

```javascript
EventDelegation
    // ...
    .listen((event) => event.delegator.classList.add('button--clicked'))
```

**Type inference**

This builder pattern allows for automatic type inference of all type information. Each of the above steps implements an interface with multiple overloads. Methods that take CSS selectors will attempt
to parse the selectors and infer the element type from them. The inferred types are then automatically
known in the listener callback provided in the `.listen()` step.

In the above example the event type is automatically identified as `MouseEvent`, and `event.delegator` (or `this`) is
identified as `HTMLButtonElement`.

**Supports complex CSS selectors**

Thanks to the great package [typed-query-selector](https://github.com/g-plane/typed-query-selector) you can even supply
complex CSS selectors and the type will automatically be inferred if the selectors are _tag-qualified_ and _valid_.
Even grouping selectors are supported, hence in the example below `event.delegator` is the union type
`HTMLButtonElement | HTMLInputElement`:

```typescript
EventDelegation
    .global()
    .events('click')
    .select('#my-div > button.submit, fieldset input.submit')
    .listen((event) => { ... })

// event is DelegationEvent<HTMLButtonElement | HTMLInputElement, MouseEvent, HTMLElement>
```

**Event instance types**

[`DelegationEvent<D, E, R>`](https://jjwesterkamp.github.io/event-delegation/modules/types.html#delegationevent) - This is the actual type of events passed to the listener functions. It has the type parameters `D` for delegator, `E` for event and `R` for root.
In the above example this means that:

- `D` - `event.delegator` (and `this` in regular functions) is `HTMLButtonElement | HTMLInputElement`
- `E` - `event` is of type `MouseEvent`, the type of click events
- `R` - `event.currentTarget` is of type `HTMLElement`, the type of the body element

**Default types**

The element types will default to `Element` for CSS selectors that are not tag-qualified or are invalid.
See the section **Selector matching failure / custom selectors** further down for details about overriding
these default types.

```typescript
EventDelegation
    .global()
    .events('click')
    .select('#my-div > .submit-button, fieldset iput.submit')
    //       ------------------------  --------------------
    //       not tag-qualified         invalid (iput)
    .listen((event) => { ... })

// event is DelegationEvent<Element, MouseEvent, HTMLElement>
```

### EventDelegation.within()
```typescript
// Pseudo
EventDelegation.within(root: Element | string): AskEvent
```

Alternatively you can add event listeners to other elements with the `within`method. It takes either an
element or a selector.

**Using elements**

In the case of an element its type is preserved and ultimately an `EventHandler<T>`
is returned:

```typescript
declare const myRoot: HTMLFormElement

// EventHandler<HTMLFormElement>
const handler = EventDelegation
    .within(myRoot)
    .events('click')
    .select('button')
    .listen((event) => { ... })
```

**Using selectors**

In the case of a selector the type is inferred from the given string just as with the `.select()` method.
If the `root` is a selector, `within()` will create one single handler for the **first matching element**.
It will throw an error if the selector is invalid or if no matching root element is found.

```typescript
const handler = EventDelegation
    .within('form#my-form')
    .events('click')
    .select('button')
    .listen((event) => { ... })

// handler is EventHandler<HTMLFormElement>
```

### EventDelegation.withinMany()
```typescript
// Pseudo
EventDelegation.withinMany(roots: Element[] | string): AskEvent
```

Finally you can add multiple listeners to many root elements at once. Similarly to `within()`, `withinMany()` takes either a selector or an array of root element references.

**Using selectors**

When passing a selector the element type is inferred from the given string if possible. The return value of the `listen()` call will be an array of `EventHandler<T>`'s:

```typescript
const handlers = EventDelegation
    .withinMany('form.my-form')
    .events('click')
    .select('button')
    .listen((event) => { ... })

// event.currentTarget is HTMLFormElement
// handlers is EventHandler<HTMLFormElement>[]
```

It also copes with complex selectors and grouping selectors that target more than one element type:

```typescript
const handlers = EventDelegation
    .withinMany('form.my-form, #article fieldset')
    .events('click')
    .select('button')
    .listen((event) => { ... })

// event.currentTarget is HTMLFormElement | HTMLFieldSetElement
// handlers is EventHandler<HTMLFormElement | HTMLFieldSetElement>[]
```

**Using elements**

Just as with `within()` you can pass `withinMany()` element references. It takes an array of elements,
and will carry their types along to give full knowledge about the possible types of `event.currentTarget`
and the created event handlers:

```typescript
declare const myForm: HTMLFormElement
declare const myFieldset: HTMLFieldSetElement

const handlers = EventDelegation
    .withinMany([myForm, myFieldset])
    .events('click')
    .select('button')
    .listen((event) => { ... })

// event.currentTarget is HTMLFormElement | HTMLFieldSetElement
// handlers is EventHandler<HTMLFormElement | HTMLFieldSetElement>[]
```

### EventHandler

All three creation methods return EventHandler instances, which has the following shape:

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
the default selector matching fails are selectors for custom web components. For such cases, all methods that take
selectors have one final signature overload as a last resort to not ruin your day. They take an explicit type argument
for the element type, and _any_ string as their selector argument:

```typescript
const handler = EventDelegation
    .within<CustomComponent>('custom-component')
    .events('click')
    .select<CustomButton>('custom-button')
    .listen((event) => { ... })

// event is DelegationEvent<CustomButton, MouseEvent, CustomComponent>
// handler is EventHandler<CustomComponent>
```

### Using custom events

When using custom event names the event types will by default be considered the base type `Event`. You can
however append definitions for your custom events to the `GlobalEventHandlersEventMap`:

```typescript
type MyEvent = Event & { foo: string }

declare global {
    interface GlobalEventHandlersEventMap {
        'my:event': MyEvent
    }
}

EventDelegation
    .global()
    .events('my:event')
    .select('td')
    .listen((event) => { console.log(event.foo) }) // works

// event is DelegationEvent<HTMLTableDataCellElement, MyEvent, HTMLElement>
```

If you do not want to add declarations to the global event map you can alternatively just provide the event
type as a type argument:

```typescript
type MyEvent = Event & { foo: string }

EventDelegation
    .global()
    .events<MyEvent>('my:event')
    .select('td')
    .listen((event) => { console.log(event.foo) }) // works too

// event is DelegationEvent<HTMLTableDataCellElement, MyEvent, HTMLElement>
```

### Initialisation with listener option `once: true`

If you give the listener-option `once: true` to addEventListener calls the listener will automatically be removed
after being called once. Since with event delegation events are _filtered_ on the condition of a CSS-selector match
against any ancestor of a respective event target, this package will actually replace `once: true` options with
`once: false`. This prevents that an event-delegation initialisation turns into a no-op because of events that don't
match. It will then remove the event listener manually after the first matching event occured.

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
    .listen((e) => { ... })

const x = handler.root()
```

## License

The MIT License (MIT). See [license file] for more information.

[license file]: https://github.com/JJWesterkamp/event-delegation/blob/master/LICENSE
[AskRoot]: https://jjwesterkamp.github.io/event-delegation/interfaces/askroot.html
[AskSelector]: https://jjwesterkamp.github.io/event-delegation/interfaces/askselector.html
[AskEvent]: https://jjwesterkamp.github.io/event-delegation/interfaces/askevent.html
[AskListener]: https://jjwesterkamp.github.io/event-delegation/interfaces/asklistener.html
[EventHandler]: https://jjwesterkamp.github.io/event-delegation/interfaces/eventhandler.html
[mdn-event-listener-options]: https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener

[cdn]: https://www.jsdelivr.com/package/npm/@jjwesterkamp/event-delegation
[cdn-min]: https://cdn.jsdelivr.net/npm/@jjwesterkamp/event-delegation/umd/event-delegation.min.js
[npm]: https://www.npmjs.com/package/@jjwesterkamp/event-delegation
[gh]: https://github.com/JJWesterkamp/event-delegation
[changelog]: https://github.com/JJWesterkamp/event-delegation/blob/master/CHANGELOG.md
[docs]: https://jjwesterkamp.github.io/event-delegation/
