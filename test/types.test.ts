import EventDelegation from '../src'
import { EventHandler } from '../src/types'

describe('Type inference', () => {

    describe('EventDelegation.global()', () => {
        test('Type inference when giving a (grouping) selector', () => {
            const handler: EventHandler<HTMLElement> = EventDelegation
            .global()
            .events('mouseenter')
            .select('tr, td')
            .listen((event) => {
                const E: MouseEvent = event
                const D: HTMLTableRowElement | HTMLTableDataCellElement = event.delegator
                const R: HTMLElement = event.currentTarget
            })
        })

        test('Type inference of explicit type arguments', () => {
            interface MyEvent extends Event { foo: string }
            interface CustomComponent extends HTMLElement { foo: 'bar' }
            interface CustomButton extends HTMLElement { baz: 42 }

            const handler: EventHandler<HTMLElement> = EventDelegation
                .global()
                .events<MyEvent>('click')
                .select<CustomButton>('custom-button')
                .listen((event) => {
                    const E: MyEvent = event
                    const D: CustomButton = event.delegator
                    const R: HTMLElement = event.currentTarget
                })
        })
    })

    describe('EventDelegation.within()', () => {
        test('Type inference when giving an element reference', () => {
            const myFieldset: HTMLFieldSetElement = document.createElement('fieldset')
            const handler: EventHandler<HTMLFieldSetElement> = EventDelegation
                .within(myFieldset)
                .events('click')
                .select('input.my-input')
                .listen((event) => {
                    const E: MouseEvent = event
                    const D: HTMLInputElement = event.delegator
                    const R: HTMLFieldSetElement = event.currentTarget
                })
        })

        test('Type inference when giving a selector', () => {
            try {
                const handler: EventHandler<HTMLFieldSetElement> = EventDelegation
                .within('fieldset.my-fieldset')
                .events('click')
                .select('input.my-input')
                .listen((event) => {
                    const E: MouseEvent = event
                    const D: HTMLInputElement = event.delegator
                        const R: HTMLFieldSetElement = event.currentTarget
                    })
                } catch(e) {
                    // Runtime can't find the root element, but that's OK. It should just compile.
                }
        })

        test('Type inference of explicit type arguments', () => {
            interface MyEvent extends Event { foo: string }
            interface CustomComponent extends HTMLElement { foo: 'bar' }
            interface CustomButton extends HTMLElement { baz: 42 }

            try {
                const handler: EventHandler<CustomComponent> = EventDelegation
                    .within<CustomComponent>('custom-component')
                    .events<MyEvent>('click')
                    .select<CustomButton>('custom-button')
                    .listen((event) => {
                        const E: MyEvent = event
                        const D: CustomButton = event.delegator
                        const R: CustomComponent = event.currentTarget
                    })
            } catch(e) {
                // Runtime can't find the root element, but that's OK. It should just compile.
            }
        })
    })

    describe('EventDelegation.withinMany()', () => {
        test('Type inference when giving element references', () => {
            const myFieldset: HTMLFieldSetElement = document.createElement('fieldset')
            const myForm: HTMLFormElement = document.createElement('form')

            const handler: EventHandler<HTMLFieldSetElement | HTMLFormElement>[] = EventDelegation
                .withinMany([myFieldset, myForm])
                .events('keyup')
                .select('input.my-input')
                .listen((event) => {
                    const E: KeyboardEvent = event
                    const D: HTMLInputElement = event.delegator
                    const R: HTMLFieldSetElement | HTMLFormElement = event.currentTarget
                })
        })

        test('Type inference when giving a selector', () => {
            const handler: EventHandler<HTMLFieldSetElement | HTMLFormElement>[] = EventDelegation
                .withinMany('fieldset, form')
                .events('click')
                .select('input.my-input, textarea.my-textarea')
                .listen((event) => {
                    const E: MouseEvent = event
                    const D: HTMLInputElement | HTMLTextAreaElement = event.delegator
                    const R: HTMLFieldSetElement | HTMLFormElement = event.currentTarget
                })
        })

        test('Type inference of explicit type arguments', () => {
            interface MyEvent extends Event { foo: string }
            interface CustomComponent extends HTMLElement { foo: 'bar' }
            interface CustomButton extends HTMLElement { baz: 42 }

            const handler: EventHandler<CustomComponent>[] = EventDelegation
                .withinMany<CustomComponent>('custom-component')
                .events<MyEvent>('click')
                .select<CustomButton>('custom-button')
                .listen((event) => {
                    const E: MyEvent = event
                    const D: CustomButton = event.delegator
                    const R: CustomComponent = event.currentTarget
                })
        })
    })
})