import PublicInterface from "../event-delegation.d";

export interface DelegationConfig {
    readonly delegatee: HTMLElement;
    readonly delegatorSelector: string;
    readonly eventName: string;
    readonly listener: PublicInterface.Listener;
}
