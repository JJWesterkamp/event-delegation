/**
 * MDN polyfill
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Element/matches
 */

/* tslint:disable */
if (!Element.prototype.matches) {

    Element.prototype.matches =
        // @ts-ignore
        Element.prototype.matchesSelector ||
        // @ts-ignore
        Element.prototype.mozMatchesSelector ||
        // @ts-ignore
        Element.prototype.msMatchesSelector ||
        // @ts-ignore
        Element.prototype.oMatchesSelector ||
        // @ts-ignore
        Element.prototype.webkitMatchesSelector ||
        function(s) {
            // @ts-ignore
            var matches = (this.document || this.ownerDocument).querySelectorAll(s),
                i = matches.length;
            // @ts-ignore
            while (--i >= 0 && matches.item(i) !== this) {}
            return i > -1;
        };
}
