import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/pages/App'

import { BrowserRouter as Router } from 'react-router-dom'
import { MantineProvider } from '@mantine/core'
import GlobalStyles from './GlobalStyles'
import { Provider } from 'react-redux'
import { persistor, store } from './store'
import { PersistGate } from 'redux-persist/integration/react'
import { ModalsProvider } from '@mantine/modals'
import { NotificationsProvider } from '@mantine/notifications'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<React.StrictMode>
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				<MantineProvider
					withGlobalStyles={true}
					withNormalizeCSS={true}
					theme={{
						primaryColor: 'green',
						white: '#f9f9f9',
					}}
				>
					<NotificationsProvider>
						<ModalsProvider>
							<GlobalStyles />
							<Router>
								<App />
							</Router>
						</ModalsProvider>
					</NotificationsProvider>
				</MantineProvider>
			</PersistGate>
		</Provider>
	</React.StrictMode>
)
