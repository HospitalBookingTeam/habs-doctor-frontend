import { Group, Header, useMantineTheme } from '@mantine/core'
import Clock from '../Clock'

const LayoutHeader = () => {
	const theme = useMantineTheme()

	return (
		<Header
			height={40}
			sx={{
				background: theme.fn.variant({
					variant: 'filled',
					color: theme.primaryColor,
				}).background,
			}}
		>
			<Group
				sx={{ height: '100%' }}
				align="center"
				position="right"
				pr="xl"
				pl="lg"
			>
				<Clock />
			</Group>
		</Header>
	)
}
export default LayoutHeader
