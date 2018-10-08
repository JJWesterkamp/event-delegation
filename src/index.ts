import { EventHandler } from "./EventHandler";
import "./polyfill/element.matches";
import { createConfig } from "./utils";

// ---------------------------------------------------------------------------
// Interface imports
// ---------------------------------------------------------------------------

import PublicInterface from "../event-delegation.d";
import { DelegationConfig } from "./private-interface";

import IStatic       = PublicInterface.Static;
import IOptions      = PublicInterface.DelegationOptions;
import ISubscription = PublicInterface.Subscription;

// ---------------------------------------------------------------------------
// Interface implementation & exports
// ---------------------------------------------------------------------------

export function delegate(options: IOptions): ISubscription {
    const config: DelegationConfig = createConfig(options);
    return new EventHandler(config);
}

const defaultNamespace: IStatic = { delegate };
export default defaultNamespace;
