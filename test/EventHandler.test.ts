import { EventHandler } from '../src/EventHandler'

describe('EventHandler', () => {

    let root: Element
    let matchingDescendant: HTMLElement
    let nonMatchingDescendant: HTMLElement
    let addSpy: jest.SpyInstance
    let removeSpy: jest.SpyInstance
    let handlerCallback: jest.Mock
    let listenerOptions: AddEventListenerOptions
    let handler: EventHandler<any>

    const dispatchMatchingEvent = (times: number = 1): Event[] => {
        const events = []

        while(times--) {
            const event = new Event('click', { bubbles: true })
            matchingDescendant.dispatchEvent(event)
            events.push(event)
        }

        return events
    }

    const dispatchNonMatchingEvent = (times: number = 1): Event[] => {
        const events = []

        while(times--) {
            const event = new Event('click', { bubbles: true })
            nonMatchingDescendant.dispatchEvent(event)
            events.push(event)
        }

        return events
    }

    beforeEach(() => {
        jest.resetAllMocks()

        root = document.createElement('div')

        matchingDescendant = document.createElement('div')
        matchingDescendant.className = 'item'
        matchingDescendant.innerText = 'Matching descendant'

        nonMatchingDescendant = document.createElement('div')
        nonMatchingDescendant.innerText = 'Non-matching descendant'
        nonMatchingDescendant.className = 'not-item'

        addSpy = jest.spyOn(root, 'addEventListener')
        removeSpy = jest.spyOn(root, 'removeEventListener')

        handlerCallback = jest.fn()

        root.append(matchingDescendant, nonMatchingDescendant)
    })

    test('Adds an event listener to the root element (once) upon construction with the right arguments', () => {

        listenerOptions = { passive: true }

        handler = new EventHandler({
            root,
            selector: '.item',
            eventType: 'click',
            listener: handlerCallback,
            listenerOptions,
        })

        expect(addSpy).toBeCalledTimes(1)
        expect(addSpy).toBeCalledWith(
            'click',
            expect.any(Function),
            listenerOptions,
        )
    })

    test('Outputs the right configuration data through its methods', () => {
        handler = new EventHandler({
            root,
            selector: '.item',
            eventType: 'click',
            listener: handlerCallback,
        })
        expect(handler.root()).toBe(root)
        expect(handler.eventType()).toEqual('click')
        expect(handler.selector()).toEqual('.item')
    })

    test('Outputs the right state while attached', () => {
        handler = new EventHandler({
            root,
            selector: '.item',
            eventType: 'click',
            listener: handlerCallback,
        })
        expect(handler.isAttached()).toBe(true)
        expect(handler.isDestroyed()).toBe(false)
    })

    test('Calls the handler callback once for each click event on matching descendants while attached', () => {
        handler = new EventHandler({
            root,
            selector: '.item',
            eventType: 'click',
            listener: handlerCallback,
        })

        for (let n = 1; n < 20; n++) {
            // Dispatch n matching events
            dispatchMatchingEvent(n)

            // Dispatch random amount of non-matching events
            const m = Math.round(Math.random() * 25)
            dispatchNonMatchingEvent(m)

            expect(handlerCallback).toBeCalledTimes(n)

            // Expect no changes in state
            expect(handler.isAttached()).toBe(true)
            expect(handler.isDestroyed()).toBe(false)
            handlerCallback.mockReset()
        }
    })

    describe('Event instances: forwarding and decoration', () => {

        test('Forwards the right event objects into the handler callback', () => {
            handler = new EventHandler({
                root,
                selector: '.item',
                eventType: 'click',
                listener: handlerCallback,
            })

            const events = dispatchMatchingEvent(10)

            events.forEach((event, i) => expect(handlerCallback.mock.calls[i][0]).toBe(event))
        })

        test('Assigns matched elements to a property "delegator" onto event objects', () => {
            handler = new EventHandler({
                root,
                selector: '.item',
                eventType: 'click',
                listener: handlerCallback,
            })

            const events = dispatchMatchingEvent(10)
            events.forEach((event, i) => expect(handlerCallback.mock.calls[i][0].delegator).toBe(matchingDescendant))
        })

        test('Calls the handler callback in the context of matched elements (this value)', () => {
            handler = new EventHandler({
                root,
                selector: '.item',
                eventType: 'click',
                listener: handlerCallback,
            })

            const events = dispatchMatchingEvent(10)
            events.forEach((event, i) => expect(handlerCallback.mock.instances[i]).toBe(matchingDescendant))
        })
    })

    describe('Implements replacement logic for "once: true"', () => {

        // non-matching events should not trigger the removal of the listener. This tests that the actual listener
        // options are replaced with our own internally created options when { once: true } was given. We want the
        // handler callback to run exactly once when matching events occur, instead of it possibly being removed before
        // it has the chance to run once because of incoming events that don't match the given delegator selector.

        test('It replaces the "once: true" option with "once: false"', () => {
            listenerOptions = { once: true }
            handler = new EventHandler({
                root,
                selector: '.item',
                eventType: 'click',
                listener: handlerCallback,
                listenerOptions,
            })

            expect(addSpy).toBeCalledWith(
                'click',
                expect.any(Function),
                expect.objectContaining({ once: false }),
            )
        })

        test('Calls the handler callback at most once when listenerOptions has "once: true"', () => {
            listenerOptions = { once: true }
            handler = new EventHandler({
                root,
                selector: '.item',
                eventType: 'click',
                listener: handlerCallback,
                listenerOptions,
            })

            dispatchMatchingEvent(10)
            expect(handlerCallback).toBeCalledTimes(1)
        })

        test('Updates its state after one matching event when listenerOptions has "once: true"', () => {
            listenerOptions = { once: true }
            handler = new EventHandler({
                root,
                selector: '.item',
                eventType: 'click',
                listener: handlerCallback,
                listenerOptions,
            })

            expect(handler.isAttached()).toBe(true)
            expect(handler.isDestroyed()).toBe(false)

            dispatchNonMatchingEvent(5)

            expect(handler.isAttached()).toBe(true)
            expect(handler.isDestroyed()).toBe(false)
            expect(removeSpy).toBeCalledTimes(0)

            // matching events should
            dispatchMatchingEvent(1)

            expect(removeSpy).toBeCalledTimes(1)
            expect(handler.isAttached()).toBe(false)
            expect(handler.isDestroyed()).toBe(true)
        })
    })


    test('Removes the native event listener when remove() is called', () => {
        handler = new EventHandler({
            root,
            selector: '.item',
            eventType: 'click',
            listener: handlerCallback,
        })

        handler.remove()
        expect(removeSpy).toBeCalledTimes(1)

        handler.remove()
        expect(removeSpy).toBeCalledTimes(1)
    })
})
