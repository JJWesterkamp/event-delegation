/**
 * Queries up the DOM for given `selector`, starting from given `startNode`.
 * The first element found matching `selector` will be returned.
 * Querying will stop as soon as given `untilElement` is encountered.
 * If no matching element was found, `null` is returned.
 *
 * @param {HTMLElement} startElement    The innermost element in the DOM tree to start searching from.
 * @param {string}      selector        The selector (CSS style) to match anchestor elements with.
 * @param {HTMLElement} untilElement    The element that acts as a scope for the query.
 *
 * Based on the MDN `closest` polyfill:
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Element/closest#Polyfill
 */
export function closestUntil(startElement: HTMLElement, selector: string, untilElement: HTMLElement = document.body): HTMLElement | null {

    if ( ! document.documentElement.contains(startElement)) {
        return null;
    }

    let current: HTMLElement = startElement;

    do {
        if (current.matches(selector)) {
            return current;
        }

        current = current.parentElement || current.parentNode as HTMLElement;

    } while (current && current !== untilElement && current.nodeType === 1);

    return null;
}
