import sinon = require('sinon');
import { EventHandler } from '../../src/EventHandler';

describe('[UNIT] EventHandler', () => {

    let handler: EventHandler;
    let spy: sinon.SinonSpy;

    beforeEach(() => {

        spy = sinon.spy();

        handler = new EventHandler({
            listener: spy,
            eventType: 'click',
            root: document.body,
            selector: 'li',
        });
    });
    
});
