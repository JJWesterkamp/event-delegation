import { matches } from './matches'

/**
 * Queries up the DOM for given `selector`, starting from given `leafElement`.
 * The first element found matching `selector` will be returned.
 * Querying will stop as soon as given `root` is encountered.
 * If no matching element was found, `null` is returned.
 *
 * Based on the {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/closest#Polyfill MDN `closest` polyfill}
 *
 * @param leaf     The innermost element in the DOM tree to start searching from.
 * @param selector The selector (CSS style) to match ancestor elements with.
 * @param root     The element that acts as a scope for the query.
 */
export function closestWithin(leaf: HTMLElement, selector: string, root: Node = document.body): HTMLElement | null {
    if (! root.contains(leaf)) {
        return null
    }

    let current: HTMLElement | null = leaf

    do {
        if (matches(current, selector)) {
            return current
        }

        current = current.parentElement
    } while (
           current !== null
        && current !== root
        && current.nodeType === Node.ELEMENT_NODE
    )

    return null
}
