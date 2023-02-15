import { Global } from '@mantine/core'

const GlobalStyles = () => {
	return (
		<Global
			styles={(theme) => ({
				'*, *::before, *::after': {
					boxSizing: 'border-box',
				},
				'#root': {
					height: '100%',
					minHeight: '100vh',
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
				'.mantine-Modal-header': {
					borderBottom: '1px solid lightgray',
					paddingBottom: '4px',
				},
				'.mantine-Modal-title': {
					fontWeight: 700,
				},
			})}
		/>
	)
}

export default GlobalStyles
