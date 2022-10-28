import { createSlice } from '@reduxjs/toolkit'
import { QueueState } from '@/entities/queue'
import { queueApi } from '@/store/queue/api'

const initialState: QueueState = {
	checkupQueue: [],
}

export const queueSlice = createSlice({
	name: 'queue',
	initialState,
	reducers: {
		resetCheckupQueue: (state) => {
			state.checkupQueue = []
		},
	},
	extraReducers: (builder) => {
		builder
			.addMatcher(
				queueApi.endpoints.getCheckupQueue.matchPending,
				(state, action) => {
					// console.log('pending', action)
				}
			)
			.addMatcher(
				queueApi.endpoints.getCheckupQueue.matchFulfilled,
				(state, action) => {
					state.checkupQueue = action.payload
				}
			)
			.addMatcher(
				queueApi.endpoints.getCheckupQueue.matchRejected,
				(state, action) => {
					// console.log('rejected', action)
				}
			)
	},
})

export const { resetCheckupQueue } = queueSlice.actions

export default queueSlice.reducer
