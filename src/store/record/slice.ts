import { createSlice } from '@reduxjs/toolkit'
import { IRecordState } from '@/entities/record'
import { queueApi } from '@/store/queue/api'

const initialState: IRecordState = {
	resetCheckup: false,
}

export const recordSlide = createSlice({
	name: 'record',
	initialState,
	reducers: {
		toggleResetCheckup: (state, action) => {
			state.resetCheckup = action.payload
		},
	},
	// extraReducers: (builder) => {
	// 	builder
	// },
})

export const { toggleResetCheckup } = recordSlide.actions

export default recordSlide.reducer
