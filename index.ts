import { createSignal, type SignalOptions, type Accessor, type Setter, type Signal as SolidSignal } from 'solid-js'

/**
 * A more concise and less error-prone form for signals.
 * @example
 * ```ts
 * const isOpen = createSignal(false)
 * console.log(isOpen()) // false
 * isOpen.set(true)
 * ```
 * 
 * # Less error-prone
 * There will be no mismatch of name between getter and setter,
 * since this form requires single binding.
 * @example
 * ```ts
 * // before
 * import { createSignal } from 'solid-js'
 * const [name, setFirstName] = createSignal('') // forgot to rename setter!
 * 
 * // after
 * import { createSignal } from '@andjsrk/signal-solid'
 * const name = createSignal('')
 * ```
 * 
 * # Concise
 * No more destructuring assignment or ugly index access, just pass/store single value.
 * @example
 * ```ts
 * // before
 * import { Signal } from 'solid-js'
 * function acceptsSignal([name, setName]: Signal<string>) {}
 * acceptsSignal([name, setName])
 * 
 * // after
 * import { Signal } from '@andjsrk/signal-solid'
 * function acceptsSignal(name: Signal<string>) {}
 * acceptsSignal(name)
 * ```
 */
export interface Signal<T> extends Accessor<T> {
	set: Setter<T>
}

/**
 * Wraps a signal from SolidJS.
 * 
 * @example
 * ```ts
 * const isOpen = wrap(createSignal(false))
 * ```
 */
export const wrap = <T>([value, setValue]: SolidSignal<T>): Signal<T> => {
	function get() {
		return value()
	}
	get.set = setValue
	return get
}

/**
 * A shortcut for `wrap(createSignal())`.
 */
export function create<T>(): Signal<T | undefined>
/**
 * A shortcut for `wrap(createSignal(...))`.
 */
export function create<T>(value: T, options?: SignalOptions<T>): Signal<T>
export function create<T>(...args: [] | [value: T, optiona?: SignalOptions<T>]): Signal<T | undefined> {
	return wrap(createSignal<T>(...args as []))
}
export { create as signal, create as createSignal }
