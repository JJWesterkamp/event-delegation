import PublicInterface from "../event-delegation";
import DelegationEventListener = PublicInterface.DelegationEventListener;

export class CompoundListener<T extends HTMLElement> {

    constructor(
        public readonly currentTarget: HTMLElement,
        public readonly events: string[],
        public readonly handler: DelegationEventListener<T>,
        public readonly listenerOptions?: AddEventListenerOptions,
    ) { }

    public start(): void {
        for (const event of this.events) {
            this.currentTarget.addEventListener(event, this.handler, this.listenerOptions);
        }
    }

    public stop(): void {
        for (const event of this.events) {
            this.currentTarget.removeEventListener(event, this.handler);
        }
    }
}
