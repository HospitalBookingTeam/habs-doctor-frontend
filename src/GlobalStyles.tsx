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
				'@media all': {
					'.page-break': {
						display: 'none',
					},
				},
				'@media print': {
					'html, body': {
						height: 'initial !important',
						margin: '0 !important',
						padding: '0 !important',
						overflow: 'initial !important',
					},
					'.page-break': {
						display: 'block',
						breakAfter: 'page',
					},
				},
				// '@page': {
				// 	size: 'auto',
				// 	margin: '20mm',
				// },
			})}
		/>
	)
}

export default GlobalStyles
