import { createDiv } from '../helpers'
import { closestWithin } from '../../src/lib/closestWithin'

describe('lib/closestWithin()', () => {

    const selector = '#my-super-selector'
    let root: HTMLElement
    let leaf: HTMLElement

    beforeEach(() => {
        root = createDiv()
        leaf = createDiv()
    })

    describe('Using Element.prototype.closest() if available', () => {

        test('Returns the closest matching element when found', () => {
            const closestElement = createDiv()

            const closestSpy  = jest.fn().mockImplementation(() => closestElement)
            const containsSpy = jest.fn().mockImplementation(() => true)

            leaf.closest  = closestSpy
            root.contains = containsSpy

            const result = closestWithin(leaf, selector, root)

            expect(closestSpy).toBeCalledWith(selector)
            expect(containsSpy).toBeCalledWith(closestElement)
            expect(result).toBe(closestElement)
        })

        test('Returns null if no closest element exists matching the selector', () => {
            const closestSpy  = jest.fn().mockImplementation(() => null)
            const containsSpy = jest.fn().mockImplementation(() => false)

            leaf.closest  = closestSpy
            root.contains = containsSpy

            const result = closestWithin(leaf, selector, root)

            expect(closestSpy).toBeCalledWith(selector)
            expect(containsSpy).not.toBeCalled()
            expect(result).toBe(null)
        })

        test('Returns null if the closest element exists outside of the root', () => {
            const closestElement = createDiv()

            const closestSpy  = jest.fn().mockImplementation(() => closestElement)
            const containsSpy = jest.fn().mockImplementation(() => false)

            leaf.closest  = closestSpy
            root.contains = containsSpy

            const result = closestWithin(leaf, selector, root)

            expect(closestSpy).toBeCalledWith(selector)
            expect(containsSpy).toBeCalledWith(closestElement)
            expect(result).toBe(null)
        })
    })

    describe('Using the fallback iterative approach otherwise', () => {

        beforeEach(() => {
            leaf.closest = undefined as any
        })

        test('Finds the innermost matching element', () => {

            const innerMatching = createDiv('matching')
            const outerMatching = createDiv('matching')

            const tree: HTMLElement = [
                leaf,
                createDiv(),
                createDiv(),
                createDiv(),
                createDiv(),
                innerMatching,
                createDiv(),
                createDiv(),
                createDiv(),
                outerMatching,
                createDiv(),
                createDiv(),
                createDiv(),
                root,
            ].reduce((tree, nextElement) => {
                nextElement.appendChild(tree)
                return nextElement
            })

            const result = closestWithin(leaf, '.matching', root)
            expect(result).toBe(innerMatching)
        })

        test('Returns null if the root is encountered first', () => {
            const innerMatching = createDiv('matching')
            const outerMatching = createDiv('matching')

            const tree: HTMLElement = [
                leaf,
                createDiv(),
                createDiv(),
                createDiv(),
                createDiv(),
                root,
                createDiv(),
                createDiv(),
                innerMatching,
                createDiv(),
                createDiv(),
                outerMatching,
                createDiv(),
                createDiv(),
            ].reduce((tree, nextElement) => {
                nextElement.appendChild(tree)
                return nextElement
            })

            const result = closestWithin(leaf, '.matching', root)
            expect(result).toBeNull()
        })

        test('Returns null if the root does not contain the leaf', () => {

            const innerMatching = createDiv('matching')
            const outerMatching = createDiv('matching')

            const tree: HTMLElement = [
                createDiv(),
                createDiv(),
                createDiv(),
                createDiv(),
                innerMatching,
                createDiv(),
                createDiv(),
                createDiv(),
                outerMatching,
                createDiv(),
                createDiv(),
                createDiv(),
                root
            ].reduce((tree, nextElement) => {
                nextElement.appendChild(tree)
                return nextElement
            })

            const result = closestWithin(leaf, '.matching', root)
            expect(result).toBeNull()
        })
    })
})