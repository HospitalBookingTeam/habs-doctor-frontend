import { createSlice } from '@reduxjs/toolkit'
import { AuthState } from '@/entities/auth'
import { authApi } from '@/store/auth/api'
import { LoginStatus } from '@/utils/renderEnums'

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
			return state
		},
		setAuthenticated: (state, action) => {
			state.isAuthenticated = action.payload
		},
	},
	extraReducers: (builder) => {
		builder
			.addMatcher(authApi.endpoints.login.matchPending, (state, action) => {})
			.addMatcher(authApi.endpoints.login.matchFulfilled, (state, action) => {
				state.information = action.payload.information
				state.token = action.payload.token
				state.isAuthenticated =
					action.payload.loginStatus === LoginStatus.THANH_CONG
			})
			.addMatcher(authApi.endpoints.login.matchRejected, (state, action) => {})
	},
})

export const { logout, setAuthenticated } = authSlice.actions

export default authSlice.reducer
