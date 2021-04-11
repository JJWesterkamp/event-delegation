import EventDelegation from '../src'
import { createBuilder as _createBuilder } from '../src/lib/createBuilder'
import { createCompositeBuilder as _createCompositeBuilder } from '../src/lib/createCompositeBuilder'
import { normalizeRoot as _normalizeRoot } from '../src/lib/normalizeRoot'
import { createDiv } from './helpers'

const createBuilder = _createBuilder as jest.Mock
const createCompositeBuilder = _createCompositeBuilder as jest.Mock
const normalizeRoot = _normalizeRoot as jest.Mock

jest.mock('../src/lib/createBuilder', () => ({
    createBuilder: jest.fn().mockImplementation((element) => element)
}))

jest.mock('../src/lib/createCompositeBuilder', () => ({
    createCompositeBuilder: jest.fn()
}))

let fetchedRoot: HTMLElement | undefined

jest.mock('../src/lib/normalizeRoot', () => ({
    normalizeRoot: jest.fn().mockImplementation((): HTMLElement => fetchedRoot = createDiv())
}))

describe('index', () => {

    beforeEach(() => {
        fetchedRoot = undefined
        createBuilder.mockClear()
        normalizeRoot.mockClear()
    })

    describe('EventDelegation.global()', () => {

        test('Calls createBuilder() with document.body', () => {
            EventDelegation.global()

            expect(createBuilder).toBeCalledTimes(1)
            expect(createBuilder).toBeCalledWith(document.body)
        })
    })

    describe('EventDelegation.within()', () => {

        test('Finds the first root element when a selector is given for root', () => {
            EventDelegation.within('.my-other-root')

            expect(normalizeRoot).toBeCalledTimes(1)
            expect(normalizeRoot).toBeCalledWith('.my-other-root')
            expect(createBuilder).toBeCalledWith(fetchedRoot)
        })

        test('Uses a given root when it is an element', () => {
            const root = createDiv()
            EventDelegation.within(root)
            expect(createBuilder).toBeCalledWith(root)
        })
    })

    describe('EventDelegation.withinMany()', () => {
        test('Calls createCompositeBuilder with a builder for all given elements', () => {
            const [elementA, elementB, elementC] = [
                createDiv('element-a'),
                createDiv('element-b'),
                createDiv('element-c'),
            ]

            EventDelegation.withinMany([elementA, elementB, elementC])

            expect(createBuilder).toBeCalledTimes(3)
            expect(createBuilder).toHaveBeenNthCalledWith(1, elementA, expect.anything(), expect.anything())
            expect(createBuilder).toHaveBeenNthCalledWith(2, elementB, expect.anything(), expect.anything())
            expect(createBuilder).toHaveBeenNthCalledWith(3, elementC, expect.anything(), expect.anything())

            expect(createCompositeBuilder).toBeCalledTimes(1)
            expect(createCompositeBuilder).toBeCalledWith(expect.arrayContaining([
                elementA,
                elementB,
                elementC,
            ]))
        })
    })
})
