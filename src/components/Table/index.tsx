import { CheckupQueue, CheckupQueueItem } from '@/entities/queue'
import { useConfirmCheckupFromQueueByIdMutation } from '@/store/queue/api'
import { formatDate } from '@/utils/formats'
import {
	CheckupRecordStatus,
	translateCheckupRecordStatus,
} from '@/utils/renderEnums'
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
	Stack,
} from '@mantine/core'
import { openConfirmModal } from '@mantine/modals'
import { showNotification } from '@mantine/notifications'
import { IconChevronRight } from '@tabler/icons'
import { Fragment } from 'react'
import { useNavigate } from 'react-router-dom'

interface QueueTableProps {
	data?: CheckupQueue
	isLoading?: boolean
}

const statusColors: Record<number, string> = {
	[CheckupRecordStatus.CHECKED_IN]: 'green',
	[CheckupRecordStatus.DANG_KHAM]: 'cyan',
	[CheckupRecordStatus.CHECKED_IN_SAU_XN]: 'pink',
}

export function QueueTable({ data, isLoading }: QueueTableProps) {
	const theme = useMantineTheme()
	const navigate = useNavigate()
	const [confirmQueueCheckupById, { isLoading: isLoadingConfirm }] =
		useConfirmCheckupFromQueueByIdMutation()

	const openModal = (patientName: string, queueId: number) =>
		openConfirmModal({
			title: 'Xác nhận khám bệnh',
			children: (
				<Text size="sm">
					Bạn sẽ khám người bệnh{' '}
					<Text color="orange" inherit component="span">
						{patientName}
					</Text>
					. Vui lòng tiếp tục để xác nhận.
				</Text>
			),
			centered: true,
			labels: { confirm: 'Tiếp tục', cancel: 'Quay lại' },
			onConfirm: () => handleConfirmQueueCheckupById(queueId),
		})

	const handleConfirmQueueCheckupById = async (queueId: number) => {
		await confirmQueueCheckupById(queueId)
			.unwrap()
			.then((payload) => navigate(`/${queueId}`))
			.catch((error) =>
				showNotification({
					title: 'Lỗi xác nhận khám bệnh',
					message: 'Đã có người bệnh khác đang khám.',
					color: 'red',
				})
			)
	}

	const rows = data?.map((item, index) => {
		const isInProgress = item?.status === CheckupRecordStatus.DANG_KHAM
		// ||
		// item?.status === CheckupRecordStatus.CHECKED_IN_SAU_XN
		const isEven = index % 2 === 0

		return (
			<Grid
				key={item.id}
				sx={{ backgroundColor: isEven ? 'white' : 'whitesmoke', width: '100%' }}
				py="sm"
			>
				<Grid.Col span={2} sx={{ textAlign: 'center' }}>
					{item.numericalOrder}
				</Grid.Col>
				<Grid.Col span={4}>
					<Text size="sm" weight={500}>
						{item.patientName}
					</Text>
				</Grid.Col>

				<Grid.Col span={2} sx={{ textAlign: 'center' }}>
					<Badge
						color={statusColors[item.status]}
						variant={theme.colorScheme === 'dark' ? 'light' : 'outline'}
					>
						{translateCheckupRecordStatus(item.status, item.isReExam)}
					</Badge>
				</Grid.Col>

				<Grid.Col span={2}>
					<Text align="center">
						{formatDate(item?.estimatedStartTime, 'HH:mm')}
					</Text>
				</Grid.Col>
				<Grid.Col span={2}>
					<Stack align={'end'}>
						<Button
							variant={isInProgress ? 'gradient' : 'filled'}
							rightIcon={isInProgress ? <IconChevronRight /> : null}
							color="green"
							gradient={{ from: 'teal', to: 'lime', deg: 105 }}
							onClick={() => {
								if (isInProgress) {
									navigate(`/${item.id}`)
									return
								}
								openModal(item.patientName, item.id)
							}}
							sx={{ width: 170 }}
						>
							{isInProgress ? 'Tiếp tục khám' : 'Khám bệnh'}
						</Button>
					</Stack>
				</Grid.Col>
			</Grid>
		)
	})

	return (
		<>
			<Grid color="gray.1" pb="md" sx={{ width: '100%' }}>
				<Grid.Col span={2} sx={{ textAlign: 'center' }}>
					Số khám bệnh
				</Grid.Col>
				<Grid.Col span={4}>Tên người bệnh</Grid.Col>
				<Grid.Col span={2} sx={{ textAlign: 'center' }}>
					Trạng thái
				</Grid.Col>
				<Grid.Col span={2}>
					<Text align="center">Thời gian dự kiến</Text>
				</Grid.Col>
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
					<LoadingOverlay visible={isLoadingConfirm} />
					{rows}
				</Stack>
			</ScrollArea>
		</>
	)
}
