import { IDelegationListenerFn } from './public-interface';

export interface IDelegationConfig<T extends HTMLElement> {
    readonly root: HTMLElement;
    readonly selector: string;
    readonly eventType: string;
    readonly listener: IDelegationListenerFn<T>;
    readonly listenerOptions?: AddEventListenerOptions;
}
