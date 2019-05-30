import { IEventHandler, IDelegationListenerFn } from './public-interface';

export interface IDelegationConfig<DG extends HTMLElement = HTMLElement> {
    readonly root: HTMLElement;
    readonly selector: string;
    readonly eventType: string;
    readonly listener: IDelegationListenerFn<DG>;
    readonly listenerOptions?: AddEventListenerOptions;
}

export interface IDelegationBuilder {
    roots(...roots: HTMLElement[]): this;
    delegators(...selectors: string[]): this;
    events(...types: string[]): this;
    listen(listener: IDelegationListenerFn): IEventHandler;
}
