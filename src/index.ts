import {DelegationConfigFactory} from './DelegationConfigFactory';
import {EventHandler} from './EventHandler';
import './polyfill/element.matches';
import {IDelegationConfig} from './private-interface';
import {IDelegationListener, IOptions, IStatic} from './public-interface';

// ---------------------------------------------------------------------------
// Interface imports
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Interface exports & implementation
// ---------------------------------------------------------------------------

const defaultNamespace: IStatic = { create };
export default defaultNamespace;

function create<T extends HTMLElement>(options: IOptions<T>): IDelegationListener {
    const config: IDelegationConfig<T> = (new DelegationConfigFactory()).fromOptions(options);
    return new EventHandler<T>(config);
}
