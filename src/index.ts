import { EventHandler } from "./EventHandler";
import "./polyfill/element.matches";
import { createConfig } from "./utils";

// ---------------------------------------------------------------------------
// Interface imports
// ---------------------------------------------------------------------------

import PublicInterface from "../event-delegation.d";
import { DelegationConfig } from "./private-interface";

import IStatic       = PublicInterface.Static;
import IOptions      = PublicInterface.IOptions;
import ISubscription = PublicInterface.Subscription;

// ---------------------------------------------------------------------------
// Interface exports & implementation
// ---------------------------------------------------------------------------

const defaultNamespace: IStatic = { create };
export default defaultNamespace;

function create(options: IOptions): ISubscription {
    const config: DelegationConfig = createConfig(options);
    return new EventHandler(config);
}
