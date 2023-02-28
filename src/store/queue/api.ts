import { Icd } from '@/entities/icd'
import { CheckupQueue } from '@/entities/queue'
import { CheckupRecord } from '@/entities/record'
import { api } from '../api'

export const queueApi = api.injectEndpoints({
	endpoints: (build) => ({
		getCheckupQueue: build.query<CheckupQueue, number | undefined>({
			query: (roomId) => ({
				url: 'checkup-queue',
				params: { 'room-id': roomId },
			}),
			providesTags: (result = []) => [
				...result.map(({ id }) => ({ type: 'Queue', id } as const)),
				{ type: 'Queue' as const, id: 'LIST' },
			],
		}),
		getFinishedCheckupQueue: build.query<CheckupQueue, number>({
			query: (roomId) => ({
				url: 'checkup-queue/finished',
				params: { 'room-id': roomId },
			}),
			providesTags: (result = []) => [
				...result.map(
					({ id }) => ({ type: 'Queue', id: `FINISHED_${id}` } as const)
				),
				{ type: 'Queue' as const, id: 'FINISHED_LIST' },
			],
		}),
		getTestingCheckupQueue: build.query<CheckupQueue, number>({
			query: (roomId) => ({
				url: 'checkup-queue/testing',
				params: { 'room-id': roomId },
			}),
			providesTags: (result = []) => [
				...result.map(
					({ id }) => ({ type: 'Queue', id: `TESTING_${id}` } as const)
				),
				{ type: 'Queue' as const, id: 'TESTING_LIST' },
			],
		}),

		confirmCheckupFromQueueById: build.mutation<void, number>({
			query: (queueId) => ({
				url: `checkup-queue/confirm/${queueId}`,
				method: 'POST',
			}),
		}),
		notifyPatient: build.mutation<void, number>({
			query: (queueId) => ({
				url: `checkup-records/notify/${queueId}`,
				method: 'GET',
			}),
		}),
	}),
})

export const {
	useGetCheckupQueueQuery,
	useGetFinishedCheckupQueueQuery,
	useGetTestingCheckupQueueQuery,
	useNotifyPatientMutation,
	useConfirmCheckupFromQueueByIdMutation,
} = queueApi

export const {
	endpoints: {
		getCheckupQueue,
		getFinishedCheckupQueue,
		getTestingCheckupQueue,

		confirmCheckupFromQueueById,
	},
} = queueApi
