import { createStyles } from '@mantine/core'

const useGlobalStyles = createStyles((theme, _params, getRef) => ({
	numberInput: {
		input: {
			textAlign: 'right',
			paddingLeft: '12px',
		},
		'input:has(+ div)': {
			paddingRight: '32px',
		},
	},
	width60: {
		'input:has(+ div)': {
			paddingRight: '60px',
		},
	},
}))

export default useGlobalStyles
