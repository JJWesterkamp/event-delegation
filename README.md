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

```bash
$ npm install @jjwesterkamp/event-delegation --save
```

## Usage

**Import package**

```javascript
import EventDelegation from '@jjwesterkamp/event-delegation';
```

**Setup options**

Create an options object for the event-delegation setup. The table below
shows the available configuration options:

| property          	| required 	| type                   	| descripton                                                                           	| default         	|
|-------------------	|----------	|-------------------------- |--------------------------------------------------------------------------------------	|-----------------	|
| `root`   	            | no       	| `HTMLElement` or `string` | Can be either an HTMLElement reference or a CSS style selector for the element.      	| `document.body` 	|
| `selector`        	| yes      	| `string`               	| Selector that matches against the delegating elements. E.g. `"li"` or `".item"`      	| N/A             	|
| `eventType`           | yes      	| `string`               	| The event type to listen for                                                         	| N/A             	|
| `listener`        	| yes      	| `function`             	| The event listener callback                                                          	| N/A             	|
| `listenerOptions` 	| no       	| `object`               	| Options object for the native event listener. [MDN docs][mdn-event-listener-options] 	| N/A             	|


For example:

```javascript
const options = {
    
    root: document.body,
    // or alternatively a CSS selector:
    root: '#root-element',
    
    selector: ".item",
    
    eventType: "click",
    
    listener(event) {
        this.classList.add("item--clicked");
    },
};
```

Note: Inside `listener`, `this` is the element that matched `".item"`. In order for this binding to work, `listener` must be a regular function - not an arrow function. In case you do want to use an arrow function the event argument has an additional property `delegator` as an alternative to the explicit this-binding:

```javascript
const options = {
    // ...
    listener: (event) => event.delegator.classList.add("item--clicked"),
};
```


**Create subscription with options**

```javascript
const delegationListener = EventDelegation.create(options);
```

**Removing the listener**

The event listener can be removed by calling `remove` on the subscription object. This action will also destroy internal references rendering the subscription useless.

```javascript
delegationListener.remove();
```


[mdn-event-listener-options]: https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
