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
	accordion: {
		border: `2px solid ${theme.colors.gray[2]}`,
	},
}))

export default useGlobalStyles
