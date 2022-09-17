import { lazy, ReactNode, Suspense, useEffect, useLayoutEffect } from 'react'
import { Routes, Route, Outlet, Navigate, useNavigate } from 'react-router-dom'
import { Container, LoadingOverlay } from '@mantine/core'
import { selectIsAuthenticated } from '@/store/auth/selectors'
import { useAppSelector } from '@/store/hooks'
import QueueDetail from './queue/detail'
import LayoutAppShell from '@/components/Layout'

const Login = lazy(() => import('@/pages/auth'))
const Queue = lazy(() => import('@/pages/queue'))
const FinishedQueue = lazy(() => import('@/pages/queue/FinishQueue'))
const TestingQueue = lazy(() => import('@/pages/queue/TestingQueue'))

function App() {
	return (
		<Suspense fallback={<LoadingOverlay visible={true} />}>
			<Container
				size="xl"
				sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
			>
				<Routes>
					<Route path="/" element={<Outlet />}>
						<Route element={<RequireAuth />}>
							<Route index element={<Queue />} />
							<Route path=":id" element={<QueueDetail />} />
							<Route path="finished" element={<Outlet />}>
								<Route index element={<FinishedQueue />} />
							</Route>
							<Route path="testing" element={<TestingQueue />} />
						</Route>

						<Route path="/login" element={<IsUserRedirect />}>
							<Route index element={<Login />} />
						</Route>
					</Route>
				</Routes>
			</Container>
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
	return !isAuthenticated ? <Outlet /> : <Navigate to={'/'} />
}

export default App
