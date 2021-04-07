# event-delegation

Event delegation for browser DOM events. Flexible, cross-browser compatible and Type-focused.

[![npm version](https://badge.fury.io/js/%40jjwesterkamp%2Fevent-delegation.svg)](https://badge.fury.io/js/%40jjwesterkamp%2Fevent-delegation)
[![Build Status](https://travis-ci.com/JJWesterkamp/event-delegation.svg?branch=master)](https://travis-ci.com/JJWesterkamp/event-delegation)
[![Coverage Status](https://coveralls.io/repos/github/JJWesterkamp/event-delegation/badge.svg?branch=master)](https://coveralls.io/github/JJWesterkamp/event-delegation?branch=master)

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

This package comes with two distinct flavours of instantiating an event handler, represented
by three main functions on the EventDelegation namespace object:
- `EventDelegation.global()`
- `EventDelegation.within(root)`
- `EventDelegation.create(options)`

1. **Builder pattern initialisation**
   
    > Both `global()` and `within()` are used to start an event listener through a builder-pattern initialisation.  
    > - The `global()` method is used to attach a global listener on the top-level `document.body` element.  
    > - The `within()` method is used to provide an alternative root element for the listener.

2. **Config object based initialisation**
   
   > The `create()` method is used to start an event listener through config-object based initialisation. 
   
### 1. Builder pattern initialisation

The package provides the two methods `global` and `within` to initialise an event handler through a builder-like pattern. 
It looks like this, using `global()` as the example:

```typescript
const handler = EventDelegation
    .global()
    .events('click')
    .select('button')
    .listen(function(event) {
        if (! this.disabled) {
            this.innerText = `${event.offsetX}/${event.offsetY}` // Works!
        }
    })
```
Inside the event listener callback, `this` is the element that matched `".item"`. In order for _this-binding_ to work, `listener` must be a
regular function. For cases where arrow functions are preferred, the event argument provides an additional property `delegator`
as an alternative:

```javascript
EventDelegation
    // ...
    .listen((event) => event.delegator.classList.add('item--clicked'))
```

This pattern is convenient because it allows for automatic type completion of practically
all required type information. Each of the above steps represent interfaces with multiple function overloads, allowing
for recognition of `WindowEventMap` keys for all native event names, and `HTMLElementTagNameMap` and `SVGElementTagNameMap`
keys for tag selectors. The inferred types are then automatically known in the `listen` step and the provided listener callback.

In the above example the event type is automatically identified as `MouseEvent`, 
and `event.delegator` (or `this`) is identified as `HTMLButtonElement` using the standard library of DOM types.

> The build process has the following 4 steps in this order, ultimately returning an `EventHandler` instance:
>
> [`AskRoot`][AskRoot] => [`AskEvent`][AskEvent] => [`AskSelector`][AskSelector] => [`AskListener`][AskListener] => [`EventHandler`][EventHandler]

For custom events and non-tag CSS selectors there are additional overloads that allow for explicit type arguments:

```typescript
type MyEvent = Event & { foo: string }

const handler = EventDelegation
    .global()
    .events<MyEvent>('my:event')
    .select<HTMLInputElement>('.input')
    .listen((e) => e.delegator.value = e.foo) // Works too!
```

#### EventDelegation.global()
```typescript
interface AskRoot {
    global(): AskEvent<HTMLElement>
}
```

The examples above used the `global()` method that attaches an event listener to `document.body` -- globally.
The returned builder ultimately builds an `EventHandler<HTMLElement>`
where `HTMLElement` is the type of the root, `document.body`.

#### EventDelegation.within()
```typescript
interface AskRoot {
    within<R extends Element>(rootOrSelector: R | string): AskEvent<R>
}
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
    .listen((e) => { /* ... */ })
```

In the case of a selector you can optionally provide an explicit type for the root when working in Typescript.
This is only recommended for non-tag selectors such as `#my-form` below. When using a tag selector,
like `'form'` for instance, the type will be inferred using the standard DOM type declarations.

```typescript
// EventHandler<HTMLFormElement>
const handlerA = EventDelegation
    .within<HTMLFormElement>('#my-form')
    .events('click')
    .select('button')
    .listen((e) => { /* ... */ })

// Also EventHandler<HTMLFormElement>!
const handlerB = EventDelegation
    .within('form')
    .events('click')
    .select('button')
    .listen((e) => { /* ... */ })
```

#### A note about roots

If the `root` is a selector, `within()` will create one single handler for the **first matching element**.

> ⚠️ Unlike some other event delegation packages, this package does not create multiple listeners for all matching
> elements when the `root` is a selector. This is a design decision because such elements could be nested within
> each other, resulting in very unpredictable behavior, including 'duplicated' handling of events that bubble through
> multiple matching roots, and inconsistencies based on whether events' `stopPropagation` methods have been called.
>
> You could of course still map a list of elements to event-handlers yourself to circumvent this 'drawback'.

### 2. Config object based initialisation

As an alternative to the builder pattern flavour, you can start event delegation with a config-object kind of initialisation.
This was the initial way this package implemented event delegation. It will remain in the package for backwards 
compatibility, and for additional flexibility. The options object for creating an event-handler in this way has the following shape:

```typescript
interface CreateParams<
    D extends Element = Element, 
    E extends Event   = Event, 
    R extends Element = Element
> {
    root?: R | string
    selector: string
    eventType: string
    listener: DelegationListener<D, E>
    listenerOptions?: boolean | AddEventListenerOptions
}
```

#### EventDelegation.create()

```typescript
interface CreateFromObject {
    create<
        D extends Element = Element,
        E extends Event = Event,
        R extends Element = Element,
        >(options: CreateParams<D, E, R>): EventHandler<R | HTMLElement>
}
```

A `CreateParams`  object can be used to start listening for events with the `create` method:

```typescript
EventDelegation.create({
    selector: '.item',
    eventType: 'click',
    listener(event) {
        this.classList.add('item--clicked');
    },
})
```

The following table gives an overview of the different properties of `CreateParams` and their function.
If the `root` is omitted from the options, `document.body` is used as the root.   
If the root is a selector, similarly to the builder pattern initialisation **the first matching element** is used 
as the root, See the earlier **note about roots**.

| property          | required | type                                                    | description                                                                     | default         |
|-------------------|----------|---------------------------------------------------------|---------------------------------------------------------------------------------|-----------------|
| `root`            | no       | `Element` or `string`                                   | Can be either an HTMLElement reference or a CSS style selector for the element. | `document.body` |
| `selector`        | yes      | `string`                                                | Selector that matches against the delegating elements. E.g. `"li"` or `".item"` | N/A             |
| `eventType`       | yes      | `string`                                                | The event type to listen for                                                    | N/A             |
| `listener`        | yes      | `function`                                              | The event listener callback                                                     | N/A             |
| `listenerOptions` | no       | `boolean` or [`AddEventListenerOptions`][mdn-event-listener-options] | Options object for the native event listener.                                   | N/A             |


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

### Working in Javascript - a few limitations

When working in Javascript you can't provide explicit type arguments for function calls as in some examples
so far. Most typescript-savvy editors will still give (near) perfect type completion for all cases where the types are
inferred, such as when using tag selectors and standard event names such as `'click'`. This is also true when passing
existing element references if they have the correct type in advance. 

In case of non-tag CSS selectors element types will most of the time default to `Element`. In the example below
`x` will probably be considered an `Element`:

```javascript
// In some JS file...
const handler = EventDelegation
    .within('#my-form')
    .events('click')
    .select('button')
    .listen((e) => { /* ... */ })

const x = handler.root()
```

When using custom events, in Javascript the event types will by default be considered the base type `Event`. You can
however append definitions for your custom event types to `WindowEventMap` in a declaration file:

```typescript
interface WindowEventMap {
    'my:event': Event & { foo: string }
}
```

Then, depending on your editor, you might be able to do this without warnings:

```javascript
EventDelegation
    .global()
    .events('my:event')
    .select('.my-element')
    .listen((e) => { console.log(e.foo.toUpperCase()) })
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
