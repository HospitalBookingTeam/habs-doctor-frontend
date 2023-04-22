import { ITestingQueue } from '@/entities/queue'
import {
	CheckupRecordStatus,
	translateCheckupRecordStatus,
} from '@/utils/renderEnums'

import {
	Badge,
	Stack,
	Group,
	Text,
	Center,
	ScrollArea,
	useMantineTheme,
	Grid,
	Button,
	Loader,
} from '@mantine/core'
import { useNavigate } from 'react-router-dom'

interface QueueTableProps {
	data?: ITestingQueue
	isLoading?: boolean
}

const statusColors: Record<number, string> = {
	[CheckupRecordStatus.CHO_THANH_TOAN_XN]: 'green',
	[CheckupRecordStatus.DA_CO_KET_QUA_XN]: 'blue',
	[CheckupRecordStatus.CHO_KET_QUA_XN]: 'orange',
}

const ProgressQueueTable = ({ data, isLoading }: QueueTableProps) => {
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
				<Grid.Col span={3}>
					<Text size="sm" weight={500}>
						{item.patientName}
					</Text>
				</Grid.Col>

				<Grid.Col span={3}>
					<Badge color={statusColors[item.status]} variant="light">
						{translateCheckupRecordStatus(item.status, item.isReExam)}
					</Badge>
				</Grid.Col>

				<Grid.Col span={4}>
					<Text lineClamp={2}>{item.operationList.join(', ')}</Text>
				</Grid.Col>
				<Grid.Col span={2}>
					<Group spacing={'sm'} align="end" position="right">
						<Button onClick={() => navigate(`/records/${item.id}`)}>
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
				<Grid.Col span={3}>Tên người bệnh</Grid.Col>
				<Grid.Col span={3}>Trạng thái</Grid.Col>
				<Grid.Col span={4}>Xét nghiệm</Grid.Col>
				<Grid.Col span={2}></Grid.Col>
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

export default ProgressQueueTable
