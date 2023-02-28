import { combineReducers, configureStore } from '@reduxjs/toolkit'
import storage from 'redux-persist/es/storage'
import authReducer from './auth/slice'
import queueReducer from './queue/slice'
import configReducer from './config/slice'
import {
	persistStore,
	persistReducer,
	FLUSH,
	REHYDRATE,
	PAUSE,
	PERSIST,
	PURGE,
	REGISTER,
} from 'redux-persist'
import { api } from '@/store/api'
import { setupListeners } from '@reduxjs/toolkit/dist/query'
import { rtkQueryErrorLogger } from './middleware/apiListener'

const persistConfig = {
	key: 'root',
	storage,
	whitelist: ['auth', 'config'],
}

const rootReducer = combineReducers({
	[api.reducerPath]: api.reducer,
	auth: authReducer,
	queue: queueReducer,
	config: configReducer,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
	reducer: persistedReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
			},
		}).concat(api.middleware, rtkQueryErrorLogger),
})

setupListeners(store.dispatch)
export const persistor = persistStore(store)

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
