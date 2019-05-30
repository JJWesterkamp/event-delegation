import { IEventHandler, IEventHandlerCollection } from './public-interface';

const unique = <T>(arr: T[]): T[] => [...new Set(arr)];

export class EventHandlerCollection implements IEventHandlerCollection {

    protected readonly _handlers: Set<IEventHandler>;

    constructor(handlers: IEventHandler[]) {
        this._handlers = new Set(handlers);
    }

    public count() {
        return this._handlers.size;
    }

    public roots(): HTMLElement[] {
        return unique(this.map((h) => h.root()));
    }

    public events(): string[] {
        return unique(this.map((h) => h.event()));
    }

    public removeAll(): void {
        this.handlers().forEach((h) => h.remove());
    }

    public handlers(): IEventHandler[] {
        return [...this._handlers].filter((h) => h.isAttached());
    }

    // ------------------------------------------------------------------------------
    //      Filter methods
    // ------------------------------------------------------------------------------

    public filter(transformer: (handler: IEventHandler) => boolean): EventHandlerCollection {
        return new EventHandlerCollection(
            this.handlers().filter(transformer),
        );
    }

    public map<T>(transformer: (handler: IEventHandler) => T): T[] {
        return this.handlers().map(transformer);
    }

    public pickByEvent(event: string): EventHandlerCollection {
        return this.filter((item) => item.event() === event);
    }

    public pickByRoot(root: HTMLElement): EventHandlerCollection {
        return this.filter((item) => item.root() === root);
    }

    public pickByDelegator(selector: string): EventHandlerCollection {
        return this.filter((item) => item.selector() === selector);
    }
}
