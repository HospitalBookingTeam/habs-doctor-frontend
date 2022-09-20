export const KEYS = {
	AUTH: {
		TOKEN: 'token',
		USER: 'user',
	},
	URLS: {
		BASE_API: import.meta.env.VITE_API_DOCTOR,
	},
}

export const SEARCH_OPTIONS = {
	keys: ['patientName'],
	threshold: 0.5,
}
