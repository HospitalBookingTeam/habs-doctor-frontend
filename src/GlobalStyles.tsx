import { Global } from '@mantine/core'

const GlobalStyles = () => {
	return (
		<Global
			styles={(theme) => ({
				'*, *::before, *::after': {
					boxSizing: 'border-box',
				},
				'#root': {
					height: '100vh',
					display: 'flex',
				},
				body: {
					...theme.fn.fontStyles(),
					backgroundColor:
						theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
					color:
						theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
					lineHeight: theme.lineHeight,
					margin: 0,
				},
			})}
		/>
	)
}

export default GlobalStyles
