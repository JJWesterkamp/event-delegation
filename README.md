# event-delegation


## Usage


Import
```javascript
import EventDelegation from 'event-delegation';
```

Setup options
```javascript
const options = {
    delegatee: document.body,
    delegatorSelector: ".item",
    eventName: "click",
    listener(event) {
        // `this` is the element that matched `".item"`
        this.classList.add(".item--clicked");
    },
};
```

Create subscription with options
```javascript
const subscription = EventDelegation.create(options);
```

When done with the event
```javascript
subscription.remove();
```
