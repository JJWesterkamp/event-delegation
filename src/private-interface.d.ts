import PublicInterface from "../event-delegation";

export interface IDelegationConfig<T extends HTMLElement> {
    readonly currentTarget: HTMLElement;
    readonly selector: string;
    readonly event: string;
    readonly listener: PublicInterface.DelegationEventListener<T>;
    readonly listenerOptions?: AddEventListenerOptions;
}
