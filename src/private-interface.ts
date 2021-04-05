import { IDelegationListenerFn } from './public-interface';

export interface IDelegationConfig<DG extends HTMLElement = HTMLElement> {
    readonly root: HTMLElement;
    readonly selector: string;
    readonly eventType: string;
    readonly listener: IDelegationListenerFn<DG>;
    readonly listenerOptions?: AddEventListenerOptions;
}
