import { createSlice } from '@reduxjs/toolkit'
import { AuthState } from '@/entities/auth'
import { authApi } from '@/store/auth/api'
import { removeLocalItem } from '@/utils/storage'

const initialState: AuthState = {
	token: '',
	isAuthenticated: false,
	information: undefined,
}

export const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		logout: (state) => {
			state = { ...initialState }
			removeLocalItem('persist:root')
			return state
		},
	},
	extraReducers: (builder) => {
		builder
			.addMatcher(authApi.endpoints.login.matchPending, (state, action) => {})
			.addMatcher(authApi.endpoints.login.matchFulfilled, (state, action) => {
				state.information = action.payload.information
				state.token = action.payload.token
				state.isAuthenticated = true
			})
			.addMatcher(authApi.endpoints.login.matchRejected, (state, action) => {})
	},
})

export const { logout } = authSlice.actions

export default authSlice.reducer
