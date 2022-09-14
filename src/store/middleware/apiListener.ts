import {
	isRejectedWithValue,
	Middleware,
	MiddlewareAPI,
} from '@reduxjs/toolkit'
import { logout } from '../auth/slice'

/**
 * Log a warning!
 */
export const rtkQueryErrorLogger: Middleware =
	(api: MiddlewareAPI) => (next) => (action) => {
		// RTK Query uses `createAsyncThunk` from redux-toolkit under the hood, so we're able to utilize these matchers!
		console.log('action', action)
		if (isRejectedWithValue(action) && action.payload.status === 401) {
			console.warn('We got a rejected action!')
			// logout
			api.dispatch(logout())
		}

		return next(action)
	}
