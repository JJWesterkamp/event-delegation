export interface IDelegationConfig {
    readonly currentTarget: HTMLElement;
    readonly selector: string;
    readonly event: string;
    readonly listener: EventListener;
    readonly listenerOptions?: AddEventListenerOptions;
}
