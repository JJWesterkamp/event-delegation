import '../polyfill/element.matches';

/**
 * Queries up the DOM for given `selector`, starting from given `leafElement`.
 * The first element found matching `selector` will be returned.
 * Querying will stop as soon as given `rootElement` is encountered.
 * If no matching element was found, `null` is returned.
 *
 * @param {HTMLElement} leafElement     The innermost element in the DOM tree to start searching from.
 * @param {string}      selector        The selector (CSS style) to match ancestor elements with.
 * @param {HTMLElement} rootElement     The element that acts as a scope for the query.
 *
 * Based on the MDN `closest` polyfill:
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Element/closest#Polyfill
 */
export function closestWithin(

    leafElement: HTMLElement,
    selector: string,
    rootElement: HTMLElement = document.body,

): HTMLElement | null {

    if ( ! rootElement.contains(leafElement)) {
        return null;
    }

    let current: HTMLElement = leafElement;

    do {
        if (current.matches(selector)) {
            return current;
        }

        current = current.parentElement || current.parentNode as HTMLElement;

    } while (
           current
        && current !== rootElement
        && current.nodeType === Node.ELEMENT_NODE
    );

    return null;
}
