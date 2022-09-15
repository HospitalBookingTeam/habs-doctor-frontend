import { Icd } from '@/entities/icd'
import { CheckupQueue } from '@/entities/queue'
import { CheckupRecord } from '@/entities/record'
import { api } from '../api'

export const queueApi = api.injectEndpoints({
	endpoints: (build) => ({
		getCheckupQueue: build.query<CheckupQueue, number>({
			query: (roomId) => ({
				url: 'checkup-queue',
				params: { 'room-id': roomId },
			}),
			providesTags: (result = []) => [
				...result.map(({ id }) => ({ type: 'Queue', id } as const)),
				{ type: 'Queue' as const, id: 'LIST' },
			],
		}),
		getCheckupRecordById: build.query<CheckupRecord, number | undefined>({
			query: (id) => ({
				url: `checkup-records/${id}`,
			}),
			providesTags: (result) => [{ type: 'Queue' as const, id: result?.id }],
		}),
		getIcdList: build.query<Icd[], void>({
			query: () => ({
				url: `icd`,
			}),
			providesTags: (result = []) => [
				...result.map(({ id }) => ({ type: 'Record', id } as const)),
				{ type: 'Record' as const, id: 'LIST' },
			],
		}),
		confirmCheckupFromQueueById: build.mutation<void, number>({
			query: (queueId) => ({
				url: `checkup-queue/confirm/${queueId}`,
				method: 'POST',
			}),
		}),
	}),
})

export const {
	useGetCheckupQueueQuery,
	useGetCheckupRecordByIdQuery,
	useGetIcdListQuery,
	useConfirmCheckupFromQueueByIdMutation,
} = queueApi

export const {
	endpoints: {
		getCheckupQueue,
		getCheckupRecordById,
		getIcdList,
		confirmCheckupFromQueueById,
	},
} = queueApi
