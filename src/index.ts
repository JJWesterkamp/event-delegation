import PublicInterface from "../event-delegation.d";

import IStatic = PublicInterface.Static;
import IOptions = PublicInterface.DelegationOptions;
import ISubscription = PublicInterface.Subscription;

import "./polyfill/element.matches";
import { closestUntil } from "./util/dom";

export function delegate(options: IOptions): ISubscription {

    options.delegatee.addEventListener(options.eventName, (event) => {

        const delegator = closestUntil(
            event.target as HTMLElement,
            options.delegatorSelector,
            options.delegatee,
        );

        if (delegator) {
            options.listener.call(delegator, event);
        }
    });
}

const defaultNamespace: IStatic = { delegate };
export default defaultNamespace;

// const subscription = delegate({
//     delegatee: document.body,
//     delegatorSelector: ".item",
//     eventName: "click",
//     listener() {
//         this.classList.add("test");
//     },
// });
