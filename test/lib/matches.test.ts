import { matches } from "../../src/lib/matches"

describe('lib/matches()', () => {
    test('Throws an error if given a non-element', () => {
        expect(() => matches('not an element' as unknown as Element, '')).toThrow(Error)
    })

    test('Uses element.matches() if available', () => {
        const element = document.createElement('div')
        const spy = jest.fn()
        element.matches = spy
        matches(element, '.some-selector')
        expect(spy).toBeCalledWith('.some-selector')
    })

    const vendorVersions = [
        'matchesSelector',
        'mozMatchesSelector',
        'msMatchesSelector',
        'oMatchesSelector',
        'webkitMatchesSelector',
    ]

    for (const vendorVersion of vendorVersions) {
        test(`Tests for existence of Element.prototype.${vendorVersion}() as fallback method`, () => {
            const element = document.createElement('div')
            const spy = jest.fn()
            element.matches = undefined as any
            element[vendorVersion] = spy
            matches(element, '.some-selector')
            expect(spy).toBeCalledWith('.some-selector')
        })
    }
})