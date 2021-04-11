import { createBuilder } from '../../src/lib/createBuilder'
import { createCompositeBuilder } from '../../src/lib/createCompositeBuilder'
import { createDiv } from '../helpers'
import { EventHandler as _EventHandler } from '../../src/EventHandler'

const EventHandler = _EventHandler as jest.Mock

jest.mock('../../src/EventHandler', () => ({
    EventHandler: jest.fn()
}))

describe('lib/createCompositeBuilder()', () => {
    test('Instantiates an EventHandler for all given builders and returns them in order', () => {
        const [elementA, elementB, elementC] = [
            createDiv('element-a'),
            createDiv('element-b'),
            createDiv('element-c'),
        ]

        const listener = jest.fn()
        const listenerOptions = { passive: true }

        createCompositeBuilder([
            createBuilder(elementA),
            createBuilder(elementB),
            createBuilder(elementC),
        ])
            .events('click')
            .select('.item')
            .listen(listener, listenerOptions)

        expect(EventHandler).toBeCalledTimes(3)

        expect(EventHandler).toHaveBeenNthCalledWith(1, expect.objectContaining({
            root: elementA,
            eventType: 'click',
            selector: '.item',
            listener,
            listenerOptions
        }))

        expect(EventHandler).toHaveBeenNthCalledWith(2, expect.objectContaining({
            root: elementB,
            eventType: 'click',
            selector: '.item',
            listener,
            listenerOptions
        }))

        expect(EventHandler).toHaveBeenNthCalledWith(3, expect.objectContaining({
            root: elementC,
            eventType: 'click',
            selector: '.item',
            listener,
            listenerOptions
        }))
    })
})