import { EventHandler } from '../../src/EventHandler';

describe('[UNIT] EventHandler', () => {

    let handler: EventHandler;

    beforeEach(() => {
        handler = new EventHandler({
            listener() {
                // ...
            },
            eventType: 'click',
            root: document.body,
            selector: 'li',
        });
    });
});
