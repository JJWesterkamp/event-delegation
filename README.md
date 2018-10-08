# event-delegation

```javascript
import { delegate } from 'event-delegation';

const subscription = delegate({

    delegatee: document.body,

    delegatorSelector: ".item",

    eventName: "click",

    listener(event) {
        this.classList.add(".item--clicked");
    },
});
```
