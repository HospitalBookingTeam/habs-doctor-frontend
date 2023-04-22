import { CheckupQueue, ITestingQueue } from '@/entities/queue'
import { baseQueryWithRetry } from '../api'
import { createApi } from '@reduxjs/toolkit/dist/query/react'

export const queueApi = createApi({
	reducerPath: 'queueApi',
	tagTypes: ['Auth', 'Queue'],
	baseQuery: baseQueryWithRetry,
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
		getTestingCheckupQueue: build.query<ITestingQueue, number>({
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
		removeFromQueue: build.mutation<
			CheckupQueue,
			{ checkupRecordId: number; roomId: number }
		>({
			query: (body) => ({
				url: `checkup-queue/remove-from-queue`,
				method: 'POST',
				body,
			}),
			async onQueryStarted({ roomId, ...patch }, { dispatch, queryFulfilled }) {
				try {
					const { data: updatedData } = await queryFulfilled

					dispatch(
						queueApi.util.updateQueryData(
							'getCheckupQueue',
							roomId,
							(draft) => {
								return updatedData
							}
						)
					)
				} catch {}
			},
		}),
	}),
})

export const {
	useGetCheckupQueueQuery,
	useGetFinishedCheckupQueueQuery,
	useGetTestingCheckupQueueQuery,
	useNotifyPatientMutation,
	useConfirmCheckupFromQueueByIdMutation,
	useRemoveFromQueueMutation,
} = queueApi

export const {
	endpoints: {
		getCheckupQueue,
		getFinishedCheckupQueue,
		getTestingCheckupQueue,

		confirmCheckupFromQueueById,
	},
} = queueApi
