import { DelegationConfigFactory } from "./DelegationConfigFactory";
import { EventHandler } from "./EventHandler";
import "./polyfill/element.matches";

// ---------------------------------------------------------------------------
// Interface imports
// ---------------------------------------------------------------------------

import { IDelegationConfig } from "./private-interface";
import { IOptions, IStatic, ISubscription } from "./public-interface";

// ---------------------------------------------------------------------------
// Interface exports & implementation
// ---------------------------------------------------------------------------

const defaultNamespace: IStatic = { create };
export default defaultNamespace;

function create<T extends HTMLElement>(options: IOptions<T>): ISubscription<T> {
    const config: IDelegationConfig<T> = (new DelegationConfigFactory()).fromOptions(options);
    return new EventHandler(config);
}
