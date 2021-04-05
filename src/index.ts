import { DelegationConfigFactory } from './DelegationConfigFactory';
import { EventHandler } from './EventHandler';
import { IEventHandler, IOptions, IStatic } from './public-interface';

const configFactory = new DelegationConfigFactory();

const defaultNamespace: IStatic = {

    create(options: IOptions): IEventHandler {
        return new EventHandler(
            configFactory.fromOptions(options),
        );
    },
};

export default defaultNamespace;
