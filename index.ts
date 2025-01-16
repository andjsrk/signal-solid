import type { Accessor, Setter, Signal as SolidSignal } from 'solid-js'

export interface Signal<T> extends Accessor<T> {
	set: Setter<T>
}

export const s = <T>([value, setValue]: SolidSignal<T>): Signal<T> => {
	function get() {
		return value()
	}
	get.set = setValue
	return get
}
