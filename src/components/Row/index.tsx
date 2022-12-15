import { createStyles, Grid, Text } from '@mantine/core'

const useStyles = createStyles((theme) => ({
	label: {
		color: theme.colors.dark,
		fontWeight: 500,
		// borderRight: '1px solid lightgray',
	},
}))

const RowWithLabel = ({
	label,
	content,
	labelSpan = 3,
}: {
	label: string
	content?: string
	labelSpan?: number
}) => {
	const { classes } = useStyles()
	return (
		<Grid
			sx={{
				// border: '1px solid lightgray',
				border: '1px solid transparent',
				borderRadius: 4,
				width: '100%',
				margin: 0,
			}}
		>
			<Grid.Col span={labelSpan} px="xs" className={classes.label}>
				<Text>{label}</Text>
			</Grid.Col>
			<Grid.Col span={12 - labelSpan} px="xs">
				<Text>{content}</Text>
			</Grid.Col>
		</Grid>
	)
}

export default RowWithLabel
