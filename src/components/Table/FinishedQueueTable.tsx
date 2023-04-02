import { CheckupQueue } from '@/entities/queue'
import { translateCheckupRecordStatus } from '@/utils/renderEnums'

import {
	Badge,
	Stack,
	Group,
	Text,
	Center,
	Anchor,
	ScrollArea,
	useMantineTheme,
	Grid,
	Divider,
	Button,
	Loader,
} from '@mantine/core'
import { useNavigate } from 'react-router-dom'

interface QueueTableProps {
	data?: CheckupQueue
	isLoading?: boolean
}

const FinishedQueueTable = ({ data, isLoading }: QueueTableProps) => {
	const theme = useMantineTheme()
	const navigate = useNavigate()

	const rows = data?.map((item, index) => {
		const isEven = index % 2 === 0
		return (
			<Grid
				sx={{
					backgroundColor: isEven ? 'white' : 'whitesmoke',
					width: '100%',
				}}
				align="center"
				p="sm"
				key={item.id}
			>
				<Grid.Col span={4}>
					<Text size="sm" weight={500}>
						{item.patientName}
					</Text>
				</Grid.Col>

				<Grid.Col span={3} sx={{ textAlign: 'center' }}>
					<Badge
						// color={jobColors[item.status.toLowerCase()]}
						variant={theme.colorScheme === 'dark' ? 'light' : 'outline'}
					>
						{translateCheckupRecordStatus(item.status, item.isReExam)}
					</Badge>
				</Grid.Col>

				<Grid.Col span={2} sx={{ textAlign: 'center' }}>
					<Badge
						size="sm"
						variant={item.isReExam ? 'light' : 'outline'}
						color="gray"
					>
						{item.isReExam ? 'Có' : 'Không'}
					</Badge>
				</Grid.Col>
				<Grid.Col span={3}>
					<Group spacing={'sm'} position="right">
						<Button
							sx={{ width: 200 }}
							onClick={() => navigate(`/records/${item.id}`)}
						>
							Xem kết quả
						</Button>
					</Group>
				</Grid.Col>
			</Grid>
		)
	})

	return (
		<>
			<Grid color="gray.1" p="sm" sx={{ width: '100%', fontWeight: 500 }}>
				<Grid.Col span={4}>Tên người bệnh</Grid.Col>
				<Grid.Col span={3} sx={{ textAlign: 'center' }}>
					Trạng thái
				</Grid.Col>
				<Grid.Col span={2} sx={{ textAlign: 'center' }}>
					Tái khám
				</Grid.Col>
				<Grid.Col span={3}></Grid.Col>
			</Grid>
			<ScrollArea sx={{ height: 450 }}>
				<Center
					sx={{
						height: 100,
						width: '100%',
						display: isLoading ? 'flex' : 'none',
					}}
				>
					<Loader size="lg" />
				</Center>
				<Stack sx={{ width: '100%' }} mt="sm">
					{rows}
				</Stack>
			</ScrollArea>
		</>
	)
}

export default FinishedQueueTable
