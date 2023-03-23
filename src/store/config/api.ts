import { api } from '../api'

export const configApi = api.injectEndpoints({
	endpoints: (build) => ({
		getTime: build.query<{ time: number }, void>({
			query: () => ({
				url: 'time',
			}),
		}),
	}),
})

export const { useLazyGetTimeQuery } = configApi

export const {
	endpoints: { getTime },
} = configApi
