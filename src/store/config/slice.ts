import { createSlice } from '@reduxjs/toolkit'
import { configApi } from './api'
import dayjs from 'dayjs'
import { getLocalTimeFromUTC } from '@/utils/formats'

const initialState: { time: number | null } = {
	time: null,
}

export const configSlice = createSlice({
	name: 'config',
	initialState,
	reducers: {
		clearConfig: (state) => {
			state = { ...initialState }
			return state
		},
	},
	extraReducers: (builder) => {
		builder.addMatcher(
			configApi.endpoints.getTime.matchFulfilled,
			(state, action) => {
				state.time =
					getLocalTimeFromUTC(action.payload.time) -
					getLocalTimeFromUTC(dayjs().toString())
			}
		)
	},
})

export const { clearConfig } = configSlice.actions

export default configSlice.reducer
