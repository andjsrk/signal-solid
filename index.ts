import type { SignalOptions, Accessor, Setter, Signal as SolidSignal } from 'solid-js'
import { createSignal, equalFn as solidDefaultEquals } from 'solid-js'

/**
 * Indicates a signal that is wrapped using {@linkcode wrap}.
 * Some features are lacking in contrast to {@linkcode Signal}.
 */
export interface WrappedSignal<T> extends Accessor<T> {
	set: Setter<T>
}

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
export interface Signal<T> extends WrappedSignal<T>, SignalOperations<T> {}
export interface SignalOperations<T> {
	/**
	 * @returns Whether the value is equal to the signal's current value.
	 */
	equals: (x: T) => boolean
}

/**
 * Wraps a signal from SolidJS.
 * 
 * @example
 * ```ts
 * const isOpen = wrap(createSignal(false))
 * ```
 */
export const wrap = <T>([value, setValue]: SolidSignal<T>): WrappedSignal<T> => {
	function get() {
		return value()
	}
	get.set = setValue
	return get
}

/**
 * A shortcut for `wrap(createSignal())`.
 * 
 * @see {@linkcode wrap}
 * @see {@linkcode createSignal}
 */
export function create<T>(): Signal<T | undefined>
/**
 * A shortcut for `wrap(createSignal(...))`.
 * 
 * @see {@linkcode wrap}
 * @see {@linkcode createSignal}
 */
export function create<T>(value: T, options?: SignalOptions<T>): Signal<T>
export function create<T>(...args: [value?: T, options?: SignalOptions<T | undefined>]): Signal<T | undefined> {
	const wrapped = wrap(createSignal<T | undefined>(...args))
	
	const [_, options] = args
	let equalsFn: SignalOperations<T>['equals']
	if (options && 'equals' in options) {
		const { equals } = options
		if (equals === false) {
			// NOTE: `equals` in `SignalOptions` and `equals` in `Signal` have different purpose
			// so the current behavior would be more reasonable
			
			// equalsFn = () => false
			equalsFn = x => solidDefaultEquals(wrapped(), x)
		} else {
			equalsFn = x => equals(wrapped()!, x)
		}
	} else {
		equalsFn = x => solidDefaultEquals(wrapped(), x)
	}
	const ops: SignalOperations<T> = {
		equals: equalsFn,
	}
	
	return Object.assign(wrapped, ops as SignalOperations<T | undefined>)
}
export { create as signal, create as createSignal }
