import { EventHandler as _EventHandler } from '../../src/EventHandler'
import { createBuilder } from '../../src/lib/createBuilder'

const EventHandler = _EventHandler as jest.Mock

jest.mock('../../src/EventHandler', () => ({
    EventHandler: jest.fn()
}))

describe('lib/createBuilder()', () => {
    test('Passes all option values unaltered to the EventHandler constructor', () => {
        const root = document.createElement('div')
        const eventType = 'focus'
        const selector = 'input'
        const listener = () => undefined
        const listenerOptions = {}

        createBuilder(root)
            .events(eventType)
            .select(selector)
            .listen(listener, listenerOptions)

        expect(EventHandler).toBeCalledTimes(1)
        expect(EventHandler).toBeCalledWith(expect.objectContaining({
            root,
            eventType,
            selector,
            listener,
            listenerOptions
        }))
    })
})