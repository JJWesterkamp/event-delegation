import PublicInterface from "../event-delegation.d";

import IStatic = PublicInterface.Static;

import "./polyfill/element.matches";
import { closestUntil } from "./util/dom";

export function delegate(delegatee: HTMLElement, delegatorSelector: string, eventName: string, callback: (e: Event) => void): void {

    delegatee.addEventListener(eventName, (event) => {

        const delegator = closestUntil(event.target as HTMLElement, delegatorSelector, delegatee);

        if (delegator) {
            callback.call(delegator, event);
        }
    });
}

const defaultNamespace: IStatic = { delegate };
export default defaultNamespace;
