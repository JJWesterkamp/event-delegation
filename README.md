# event-delegation

My take on an event-delegation implementation for browser UI events:

- One single function signature
- Uses an options object. No confusing parameter lists
- Calls listener callbacks in the context of matched _delegator_ elements
- Fully typed

## Installation

```bash
$ npm install @jjwesterkamp/event-delegation --save
```

## Usage

### 1. Import package

```javascript
import EventDelegation from 'event-delegation';
```

### 2. Setup options

Create an options object (or inline it in the create call as you like) for the event-delegation setup.

| property          	| required 	| type                   	| descripton                                                                           	| default         	|
|-------------------	|----------	|------------------------	|--------------------------------------------------------------------------------------	|-----------------	|
| `currentTarget`   	| no       	| `HTMLElement | string` 	| Can be either an HTMLElement reference or a CSS style selector for the element.      	| `document.body` 	|
| `selector`        	| yes      	| `string`               	| Selector that matches against the delegating elements. E.g. `"li"` or `".item"`      	| N/A             	|
| `event`           	| yes      	| `string`               	| The event type to listen for                                                         	| N/A             	|
| `listener`        	| yes      	| `function`             	| The event listener callback                                                          	| N/A             	|
| `listenerOptions` 	| no       	| `object`               	| Options object for the native event listener. [MDN docs][mdn-event-listener-options] 	| N/A             	|

**Example object:**

```javascript
const options = {
    currentTarget: document.body,
    selector: ".item",
    event: "click",
    listener(event) {
        this.classList.add(".item--clicked");
    },
};
```

Note: Inside `listener`, `this` is the element that matched `".item"`. In order for this binding to work, `listener` must be a regular function - not an arrow function.

### 3. Create subscription with options
```javascript
const subscription = EventDelegation.create(options);
```

### Removing the listener

The event listener can be removed by calling `remove` on the subscription object.

> This action will also destroy internal references to improve GC performance
```javascript
subscription.remove();
```


[mdn-event-listener-options]: https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#Other_notes
