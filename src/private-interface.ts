import { IDelegationEventListener } from "./public-interface";

export interface IDelegationConfig<T extends HTMLElement> {
    readonly currentTarget: HTMLElement;
    readonly selector: string;
    readonly event: string;
    readonly listener: IDelegationEventListener<T>;
    readonly listenerOptions?: AddEventListenerOptions;
}
