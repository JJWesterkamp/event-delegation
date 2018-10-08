import PublicInterface from "../event-delegation.d";

export interface DelegationConfig {
    delegatee: HTMLElement;
    delegatorSelector: string;
    eventName: string;
    listener: PublicInterface.Listener;
}
