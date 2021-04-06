# event-delegation

Event delegation for browser DOM events. Flexible, cross-browser compatible and Type-focused.

[![npm version](https://badge.fury.io/js/%40jjwesterkamp%2Fevent-delegation.svg)](https://badge.fury.io/js/%40jjwesterkamp%2Fevent-delegation)
[![Build Status](https://travis-ci.com/JJWesterkamp/event-delegation.svg?branch=master)](https://travis-ci.com/JJWesterkamp/event-delegation)
[![Coverage Status](https://coveralls.io/repos/github/JJWesterkamp/event-delegation/badge.svg?branch=master)](https://coveralls.io/github/JJWesterkamp/event-delegation?branch=master)

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

The package has both a default export and a named export `EventDelegation` which are both the same value.
You can import with your preferred method:

```typescript
// either
import EventDelegation from '@jjwesterkamp/event-delegation'
// or
import { EventDelegation } from '@jjwesterkamp/event-delegation'
```

There are three main methods on the import:
- `EventDelegation.create(options)`
- `EventDelegation.global()`
- `EventDelegation.within(root)`

This package comes with two distinct flavours of instantiating an event handler:

1. **Config object based initialisation**
   
   > The `create()` method is used to start an event listener through config-object based initialisation. 
   
2. **Builder pattern initialisation**
   
    > Both `global()` and `within()` are used to start an event listener through a builder-pattern initialisation.  
    > - The `global()` method is used to attach a global listener on the top-level `document.body` element.  
    > - The `within()` method is used to provide an alternative root element for the listener.


### 1. Config object based initialisation

The config object initialisation was the initial way this package implemented event delegation, and remains
in the package for backwards compatibility, and for additional flexibility. The options object for creating
an event-handler in this way has the following shape:

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
    listenerOptions?: AddEventListenerOptions
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

Inside `listener`, `this` is the element that matched `".item"`. In order for _this-binding_ to work, `listener` must be a 
regular function. For cases where arrow functions are preferred, the event argument provides an additional property `delegator` 
as an alternative:

```javascript
EventDelegation.create({
    // ...
    listener: (event) => event.delegator.classList.add('item--clicked'),
})
```

#### A note about roots

If the `root` is omitted from configuration, `document.body` is used as the root.   
If the root is a selector, **the first matching element** is used as the root.

> ⚠️ Unlike some other event delegation packages, this package does not create multiple listeners for all matching
> elements when the `root` is a selector. This is a design decision because such elements could be nested within
> each other, resulting in very unpredictable behavior, including 'duplicated' handling of events that bubble through
> multiple matching roots, and inconsistencies based on whether events' `stopPropagation` methods have been called.
> 
> You could of course still map a list of elements to event-handlers yourself to circumvent this 'drawback'. 

The following table gives an overview of the different properties of `CreateParams` and their function:

| property          | required | type                                                    | description                                                                     | default         |
|-------------------|----------|---------------------------------------------------------|---------------------------------------------------------------------------------|-----------------|
| `root`            | no       | `Element` or `string`                                   | Can be either an HTMLElement reference or a CSS style selector for the element. | `document.body` |
| `selector`        | yes      | `string`                                                | Selector that matches against the delegating elements. E.g. `"li"` or `".item"` | N/A             |
| `eventType`       | yes      | `string`                                                | The event type to listen for                                                    | N/A             |
| `listener`        | yes      | `function`                                              | The event listener callback                                                     | N/A             |
| `listenerOptions` | no       | [`AddEventListenerOptions`][mdn-event-listener-options] | Options object for the native event listener.                                   | N/A             |


### 2. Builder pattern initialisation

As an alternative to the config-object flavour the package also provides the two methods `global` and `within` to initialise 
an event handler through a builder-like pattern. It looks like this, using `global()` as the example:

#### `EventDelegation.global()`

```typescript
const handler = EventDelegation
    .global()
    .events('click')
    .select('button')
    .listen((e) => {
        if (! e.delegator.disabled) {
            e.delegator.innerText = `${e.offsetX}/${e.offsetY}` // Works!
        }
    })
```
This pattern is convenient because it allows for automatic type completion of practically
all required type information. Each of the above steps represent interfaces with multiple function overloads, allowing
for recognition of `WindowEventMap` keys for all native event names, and `HTMLElementTagNameMap` and `SVGElementTagNameMap`
keys for tag selectors. The inferred types are then automatically known in the `listen` step and the provided listener callback.

In the above example the event type is automatically identified as `MouseEvent`, and `e.delegator` is identified as
`HTMLButtonElement` using the standard library of DOM types.

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

### EventDelegation.global()
```typescript
interface AskRoot {
    global(): AskEvent<HTMLElement>
}
```

The examples above used the `global()` method that attaches an event listener to `document.body` -- globally.
The returned builder ultimately builds an `EventHandler<HTMLElement>` 
where `HTMLElement` is the type of the root, `document.body`.

### EventDelegation.within()
```typescript
interface AskRoot {
    within<R extends Element>(rootOrSelector: R | string): AskEvent<R>
}
```

Alternatively you can add event listeners to other elements with the `within`method. Similarly to the config-object 
initialisation it takes either an element or a selector. In the case of an element its type is preserved and ultimately
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

In the case of a selector you can provide an explicit type for the root. `within()` will also create one handler for
the first element matching the given selector. See the earlier **note about roots**.
```typescript
// EventHandler<HTMLFormElement>
const handler = EventDelegation
    .within<HTMLFormElement>('#my-form')
    .events('change')
    .select('button')
    .listen((e) => { /* ... */ })
```

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

## License

The MIT License (MIT). See [license file] for more information.

[license file]: https://github.com/JJWesterkamp/event-delegation/blob/master/LICENSE
[AskRoot]: https://github.com/JJWesterkamp/event-delegation/blob/develop/event-delegation.d.ts#L48
[AskEvent]: https://github.com/JJWesterkamp/event-delegation/blob/develop/event-delegation.d.ts#L67
[AskSelector]: https://github.com/JJWesterkamp/event-delegation/blob/develop/event-delegation.d.ts#L89
[AskListener]: https://github.com/JJWesterkamp/event-delegation/blob/develop/event-delegation.d.ts#L116
[EventHandler]: https://github.com/JJWesterkamp/event-delegation/blob/develop/event-delegation.d.ts#L19

[mdn-event-listener-options]: https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
