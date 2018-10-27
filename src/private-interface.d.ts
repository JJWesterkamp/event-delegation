import PublicInterface from "../event-delegation";

export interface IDelegationConfig {
    readonly currentTarget: HTMLElement;
    readonly selector: string;
    readonly event: string;
    readonly listener: PublicInterface.DelegationEventListener;
    readonly listenerOptions?: AddEventListenerOptions;
}
