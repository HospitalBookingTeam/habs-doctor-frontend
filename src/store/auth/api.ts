import { AuthForm, AuthUser } from '@/entities/auth'
import { Room } from '@/entities/room'
import { retry } from '@reduxjs/toolkit/query/react'
import { api } from '../api'

export const authApi = api.injectEndpoints({
	endpoints: (build) => ({
		login: build.mutation<{ token: string; information: AuthUser }, any>({
			query: (credentials: AuthForm) => ({
				url: 'login',
				method: 'POST',
				body: credentials,
			}),
			extraOptions: {
				backoff: () => {
					// We intentionally error once on login, and this breaks out of retrying. The next login attempt will succeed.
					retry.fail({ fake: 'error' })
				},
			},
		}),
		getRoomList: build.query<Room[], void>({
			query: () => ({
				url: `rooms`,
			}),
			providesTags: (result = []) => [
				...result.map(({ id }) => ({ type: 'Auth', id } as const)),
				{ type: 'Auth' as const, id: 'ROOMS' },
			],
		}),
	}),
})

export const { useLoginMutation, useGetRoomListQuery } = authApi

export const {
	endpoints: { login, getRoomList },
} = authApi
