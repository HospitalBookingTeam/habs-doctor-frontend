import { RootState } from '..'

export const selectAuth = (state: RootState) => state.auth

export const selectIsAuthenticated = (state: RootState) =>
	state.auth.isAuthenticated
