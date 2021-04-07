import EventDelegation from '../src'
import { EventHandler as _EventHandler } from '../src/EventHandler'
import { normalizeRoot as _normalizeRoot } from '../src/lib/normalizeRoot'

const EventHandler = _EventHandler as jest.Mock
const normalizeRoot = _normalizeRoot as jest.Mock

jest.mock('../src/EventHandler', () => ({
    EventHandler: jest.fn()
}))

let fetchedRoot: HTMLElement

jest.mock('../src/lib/normalizeRoot', () => ({
    normalizeRoot: jest.fn().mockImplementation((): HTMLElement => fetchedRoot = document.createElement('div'))
}))

describe('index', () => {

    beforeEach(() => {
        EventHandler.mockClear()
        normalizeRoot.mockClear()
    })

    describe('EventDelegation.global()', () => {

        test('Passes all option values unaltered to the EventHandler constructor', () => {
            const eventType = 'focus'
            const selector = 'input'
            const listener = () => undefined
            const listenerOptions = {}

            EventDelegation
                .global()
                .events(eventType)
                .select(selector)
                .listen(listener, listenerOptions)

            expect(EventHandler).toBeCalledTimes(1)
            expect(EventHandler).toBeCalledWith(expect.objectContaining({
                eventType,
                selector,
                listener,
                listenerOptions
            }))
        })

        test('Uses document.body as the root', () => {
            EventDelegation.global().events('doesnt').select('matter').listen(() => undefined)
            expect(EventHandler).toBeCalledWith(expect.objectContaining({ root: document.body }))
        })
    })

    describe('EventDelegation.within()', () => {
        test('Passes all non-root option values unaltered to the EventHandler constructor', () => {
            const eventType = 'click'
            const selector = 'button'
            const listener = () => undefined
            const listenerOptions = {}

            EventDelegation
                .within('')
                .events(eventType)
                .select(selector)
                .listen(listener, listenerOptions)

            expect(EventHandler).toBeCalledTimes(1)
            expect(EventHandler).toBeCalledWith(expect.objectContaining({
                eventType,
                selector,
                listener,
                listenerOptions
            }))
        })

        test('Finds the first root element when a selector is given for root', () => {
            EventDelegation
                .within('.my-other-root')
                .events('dont')
                .select('matter')
                .listen(() => undefined)


            expect(normalizeRoot).toBeCalledTimes(1)
            expect(normalizeRoot).toBeCalledWith('.my-other-root')
            expect(EventHandler).toBeCalledWith(expect.objectContaining({
                root: fetchedRoot,
            }))
        })

        test('Uses a given root when it is an element', () => {
            const root = document.createElement('div')
            EventDelegation.within(root).events('doesnt').select('matter').listen(() => undefined)
            expect(EventHandler).toBeCalledWith(expect.objectContaining({ root }))
        })
    })

    describe('EventDelegation.create()', () => {
        test('Passes all non-root option values unaltered to the EventHandler constructor', () => {

            const root = document.createElement('div')
            const eventType = 'focus'
            const selector = 'input'
            const listener = () => undefined
            const listenerOptions = {}

            EventDelegation.create({
                root,
                eventType,
                selector,
                listener,
                listenerOptions,
            })

            expect(EventHandler).toBeCalledTimes(1)
            expect(EventHandler).toBeCalledWith(expect.objectContaining({
                root,
                eventType,
                selector,
                listener,
                listenerOptions
            }))
        })

        test('Finds the first root element when a selector is given for root', () => {

            EventDelegation.create({
                root: '.some-root',
                eventType: 'focus',
                selector: 'input',
                listener: () => undefined,
                listenerOptions: {},
            })


            expect(normalizeRoot).toBeCalledTimes(1)
            expect(normalizeRoot).toBeCalledWith('.some-root')
            expect(EventHandler).toBeCalledWith(expect.objectContaining({
                root: fetchedRoot,
            }))
        })

        test('Uses document.body as root when a root is omitted', () => {
            EventDelegation.create({
                eventType: 'focus',
                selector: 'input',
                listener: () => undefined,
                listenerOptions: {},
            })

            expect(EventHandler).toBeCalledWith(expect.objectContaining({
                root: document.body,
            }))
        })
    })
})