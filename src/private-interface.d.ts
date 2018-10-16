export interface DelegationConfig {
    readonly currentTarget: HTMLElement;
    readonly selector: string;
    readonly event: string;
    readonly listener: EventListener;
}
