import PublicInterface from "../event-delegation.d";

import IDelegationOptions = PublicInterface.DelegationOptions;
import ISubscription = PublicInterface.EventSubscription;

export class EventSubscription implements ISubscription {


    constructor(protected readonly config: IDelegationOptions) {

    }

    suspend(): void {
        delete this.config;
    }

}
