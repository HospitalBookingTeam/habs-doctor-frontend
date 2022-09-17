import { CheckupQueue, CheckupQueueItem } from '@/entities/queue'
import { useConfirmCheckupFromQueueByIdMutation } from '@/store/queue/api'
import { CheckupRecordStatus } from '@/utils/renderEnums'
import {
	Avatar,
	Badge,
	Table,
	Group,
	Text,
	Center,
	Anchor,
	ScrollArea,
	useMantineTheme,
	Grid,
	Divider,
	Button,
	LoadingOverlay,
	Loader,
} from '@mantine/core'
import { openConfirmModal } from '@mantine/modals'
import { showNotification } from '@mantine/notifications'
import { Fragment } from 'react'
import { useNavigate } from 'react-router-dom'

interface QueueTableProps {
	data?: CheckupQueue
	isLoading?: boolean
}

const ProgressQueueTable = ({ data, isLoading }: QueueTableProps) => {
	const theme = useMantineTheme()
	const navigate = useNavigate()

	const rows = data?.map((item) => {
		return (
			<Fragment key={item.id}>
				<Grid.Col span={1} sx={{ textAlign: 'center' }}>
					<Anchor<'a'>
						size="sm"
						href="#"
						onClick={(event) => event.preventDefault()}
					>
						{item.numericalOrder}
					</Anchor>
				</Grid.Col>
				<Grid.Col span={4}>
					<Group spacing="sm">
						<Text size="sm" weight={500}>
							{item.patientName}
						</Text>
					</Group>
				</Grid.Col>

				<Grid.Col span={2} sx={{ textAlign: 'center' }}>
					<Badge
						// color={jobColors[item.status.toLowerCase()]}
						variant={theme.colorScheme === 'dark' ? 'light' : 'outline'}
					>
						{item.status}
					</Badge>
				</Grid.Col>

				<Grid.Col span={1} sx={{ textAlign: 'center' }}>
					<Badge
						size="sm"
						variant={item.isReExam ? 'light' : 'outline'}
						color="gray"
					>
						{item.isReExam ? 'Có' : 'Không'}
					</Badge>
				</Grid.Col>
				<Grid.Col span={4}>
					<Group spacing={'sm'} position="right">
						<Button color="cyan" sx={{ width: 140 }}>
							Xem hồ sơ
						</Button>
					</Group>
				</Grid.Col>
				<Grid.Col span={12}>
					<Divider />
				</Grid.Col>
			</Fragment>
		)
	})

	return (
		<>
			<Grid color="gray.1" pb="md" sx={{ width: '100%' }}>
				<Grid.Col span={1} sx={{ textAlign: 'center' }}>
					STT
				</Grid.Col>
				<Grid.Col span={4}>Tên người bệnh</Grid.Col>
				<Grid.Col span={2} sx={{ textAlign: 'center' }}>
					Trạng thái
				</Grid.Col>
				<Grid.Col span={1} sx={{ textAlign: 'center' }}>
					Tái khám
				</Grid.Col>
				<Grid.Col span={4}></Grid.Col>
			</Grid>
			<Divider />
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
				<Grid sx={{ width: '100%' }} gutter="md" mt="md" align={'baseline'}>
					{rows}
				</Grid>
			</ScrollArea>
		</>
	)
}

export default ProgressQueueTable
