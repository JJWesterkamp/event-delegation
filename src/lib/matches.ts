import { isFunction } from './isFunction'

/**
 * An interface extension for `Element` based on the
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/matches MDN `matches` polyfill}
 * used for cross-browser compatible CSS selector matching.
 */
interface XBrowserElement extends Element {
    document?: Document
    matchesSelector?(selectors: string): boolean
    mozMatchesSelector?(selectors: string): boolean
    msMatchesSelector?(selectors: string): boolean
    oMatchesSelector?(selectors: string): boolean
}

/**
 * Tells whether given element matches a given CSS selector.
 *
 * @param element
 * @param selector
 */
export function matches(element: XBrowserElement, selector: string) {
    if (! (element instanceof Element)) {
        throw new Error('cannot match a non-element against a selector')
    }

    if (isFunction(element.matches)) return element.matches(selector)
    if (isFunction(element.matchesSelector)) return element.matchesSelector(selector)
    if (isFunction(element.mozMatchesSelector)) return element.mozMatchesSelector(selector)
    if (isFunction(element.msMatchesSelector)) return element.msMatchesSelector(selector)
    if (isFunction(element.oMatchesSelector)) return element.oMatchesSelector(selector)
    if (isFunction(element.webkitMatchesSelector)) return element.webkitMatchesSelector(selector)

    const matches = (element.document || element.ownerDocument).querySelectorAll(selector)
    let i = matches.length

    while (--i >= 0 && matches.item(i) !== element) {
    }

    return i > -1
}
