import { normalizeRoot } from "../../src/lib/normalizeRoot"

describe('lib/normalizeRoot()', () => {

    beforeEach(() => jest.clearAllMocks())

    test('Returns its argument if it is an element', () => {
        const element = document.createElement('div')
        const result = normalizeRoot(element)
        expect(result).toBe(element)
    })

    test('Queries the document if a selector is given', () => {
        const element = document.createElement('div')

        const spy = jest
            .spyOn(document, 'querySelector')
            .mockImplementation(() => element)

        const result = normalizeRoot('.some-selector')

        expect(spy).toBeCalledTimes(1)
        expect(spy).toBeCalledWith('.some-selector')
        expect(result).toBe(element)
    })

    test('Throws an error if it fails to find an element matching a selector', () => {
        const spy = jest
            .spyOn(document, 'querySelector')
            .mockImplementation(() => null)

        expect(() => normalizeRoot('.another-selector')).toThrow(Error)
        expect(() => normalizeRoot('.another-selector')).toThrow('.another-selector')
        expect(spy).toBeCalledTimes(2)
        expect(spy).toBeCalledWith('.another-selector')
    })
})