import { lazy, ReactNode, Suspense, useEffect, useLayoutEffect } from 'react'
import { Routes, Route, Outlet, Navigate, useNavigate } from 'react-router-dom'
import { Center, Container, LoadingOverlay } from '@mantine/core'
import { selectIsAuthenticated } from '@/store/auth/selectors'
import { useAppSelector } from '@/store/hooks'
import QueueDetail from './queue/detail'
import LayoutAppShell from '@/components/Layout'
import { useLazyGetTimeQuery } from '@/store/config/api'
import { selectTime } from '@/store/config/selectors'

const Login = lazy(() => import('@/pages/auth'))
const Queue = lazy(() => import('@/pages/queue'))
const FinishedQueue = lazy(() => import('@/pages/queue/FinishQueue'))
const TestingQueue = lazy(() => import('@/pages/queue/TestingQueue'))
const RecordHistory = lazy(() => import('@/pages/history'))
const NotFound = lazy(() => import('@/components/NotFound/NotFoundPage'))

function App() {
	const isAuthenticated = useAppSelector(selectIsAuthenticated)
	const configTime = useAppSelector(selectTime)
	const [triggerTimeConfig] = useLazyGetTimeQuery()
	useEffect(() => {
		const getTime = async () => {
			await triggerTimeConfig()
		}
		if (isAuthenticated && configTime === null) {
			getTime()
		}
	}, [isAuthenticated, configTime])

	return (
		<Suspense fallback={<LoadingOverlay visible={true} />}>
			<Routes>
				<Route path="/" element={<Outlet />}>
					<Route element={<RequireAuth />}>
						<Route index element={<Queue />} />
						<Route path=":id" element={<QueueDetail />} />
						<Route path="finished" element={<Outlet />}>
							<Route index element={<FinishedQueue />} />
						</Route>
						<Route path="testing" element={<TestingQueue />} />
						<Route path="records" element={<Outlet />}>
							<Route path=":id" element={<RecordHistory />} />
						</Route>
					</Route>
					<Route path="*" element={<NotFound />} />
				</Route>
				<Route path="/login" element={<IsUserRedirect />}>
					<Route index element={<Login />} />
				</Route>
			</Routes>
		</Suspense>
	)
}

const RequireAuth = () => {
	const isAuthenticated = useAppSelector(selectIsAuthenticated)

	const navigate = useNavigate()
	useLayoutEffect(() => {
		if (isAuthenticated) return
		navigate('/login')
	}, [isAuthenticated, navigate])

	return isAuthenticated ? (
		<LayoutAppShell>
			<Outlet />
		</LayoutAppShell>
	) : (
		<Navigate to={'/login'} />
	)
}
const IsUserRedirect = () => {
	const isAuthenticated = useAppSelector(selectIsAuthenticated)
	return !isAuthenticated ? (
		<Center sx={{ width: '100%' }}>
			<Container size="xl">
				<Outlet />
			</Container>
		</Center>
	) : (
		<Navigate to={'/'} />
	)
}

export default App
