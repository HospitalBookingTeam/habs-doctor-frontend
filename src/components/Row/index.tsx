import { createStyles, Grid, Text } from '@mantine/core'

const useStyles = createStyles((theme) => ({
	label: {
		color: theme.colors.gray[6],
		borderRight: '1px solid lightgray',
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
				border: '1px solid lightgray',
				borderRadius: 4,
				width: '100%',
				margin: 0,
			}}
		>
			<Grid.Col span={labelSpan} p="xs" className={classes.label}>
				<Text>{label}</Text>
			</Grid.Col>
			<Grid.Col span={12 - labelSpan} p="xs">
				<Text>{content}</Text>
			</Grid.Col>
		</Grid>
	)
}

export default RowWithLabel
