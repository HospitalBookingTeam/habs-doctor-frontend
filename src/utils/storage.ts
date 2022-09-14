export const getLocalItem = (key: string) => {
	return localStorage.getItem(key)
}

export const setLocalItem = (key: string, value: string) => {
	return localStorage.setItem(key, value)
}
export const removeLocalItem = (key: string) => {
	return localStorage.removeItem(key)
}

export const parseLocalItem = (key: string) => {
	const item = localStorage.getItem(key)
	if (!item) return
	return JSON.parse(item)
}

export const stringifyLocalItem = (key: string, value: any) => {
	return localStorage.setItem(key, JSON.stringify(value))
}
