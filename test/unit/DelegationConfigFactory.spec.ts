import { DelegationConfigFactory } from '../../src/DelegationConfigFactory';
import { IDelegationEvent, IOptions } from '../../src/public-interface';

describe('[UNIT] DelegationConfigFactory', () => {

    describe('#fromOptions()', () => {

        let factory: DelegationConfigFactory;
        let options: IOptions;

        beforeEach(() => {

            factory = new DelegationConfigFactory();

            options = {

                selector: 'li',
                eventType: 'click',

                listener: (event: IDelegationEvent) => {
                    // ...
                },

                listenerOptions: {
                    capture: false,
                    once: false,
                    passive: false,
                },
            };
        });

        describe('[option] eventType', () => {

            it('Should accept and set any string value', () => {
                const config = factory.fromOptions(
                    Object.assign(options, { eventType: 'any string value' }),
                );
                expect(config.eventType).toEqual('any string value');
            });
        });

        describe('[option] listener', () => {

            it('Should throw an error if listener is not a function', () => {
                expect(() => factory.fromOptions(
                    Object.assign(options, { listener: 'not a function' }),
                ))
                    .toThrow(Error);
            });
        });

        describe('[option] listenerOptions (this is just pass-through data for `EventTarget.addEventListener`)', () => {

            it('Should accept and set any value', () => {
                // ...
            });
        });

        // ------------------------------------------------------------------------------
        //      # root
        // ------------------------------------------------------------------------------

        describe('[option] root', () => {

            it('Should accept a valid CSS selector to query for root', () => {
                const config = factory.fromOptions(
                    Object.assign(options, { root: 'body' }),
                );
                expect(config.root).toEqual(document.body);
            });

            it('Should throw an error if given a malformed CSS selector for root', () => {
                expect(() => factory.fromOptions(
                    Object.assign(options, { root: '<<' }),
                ))
                    .toThrow(Error);
            });

            it('Should accept an HTMLElement reference for root', () => {
                const root = document.createElement('div');
                const config = factory.fromOptions(
                    Object.assign(options, { root }),
                );

                expect(config.root).toEqual(root);
            });

            it('Should set root to `document.body` if not given a value', () => {
                delete options.root;
                const config = factory.fromOptions(options);
                expect(config.root).toEqual(document.body);
            });
        });

        describe('[option] selector', () => {

            // The selector is used to match against elements down the event's bubble
            // branch. The selector will be in use by an EventHandler's runtime, so
            // the factory should assert it's a valid selector to prevent surprises
            // later on.
            it('Should throw an error if given an invalid delegator selector', () => {
                expect(() => factory.fromOptions(
                    Object.assign(options, { selector: '<<' }),
                ))
                    .toThrow(Error);
            });

        });

    });
});
