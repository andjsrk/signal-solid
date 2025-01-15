import type { Signal } from 'solid-js'

export const s = <T>([value, setValue]: Signal<T>) => {
	function get() {
		return value()
	}
	get.set = setValue
	return get
}
