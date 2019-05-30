import { JSDOM } from 'jsdom';

export function dom() {
    return new JSDOM(`
        <ul>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
        </ul>
    `);
}
