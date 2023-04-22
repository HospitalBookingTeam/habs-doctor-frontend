import { CheckupQueue, CheckupQueueItem } from '@/entities/queue'
import { selectAuth } from '@/store/auth/selectors'
import { useAppSelector } from '@/store/hooks'
import {
	useConfirmCheckupFromQueueByIdMutation,
	useNotifyPatientMutation,
	useRemoveFromQueueMutation,
} from '@/store/queue/api'
import { formatDate } from '@/utils/formats'
import {
	CheckupRecordStatus,
	translateCheckupRecordStatus,
	translateSession,
} from '@/utils/renderEnums'
import {
	Badge,
	Text,
	Center,
	ScrollArea,
	useMantineTheme,
	Grid,
	Button,
	LoadingOverlay,
	Loader,
	Stack,
	Group,
	ActionIcon,
	Tooltip,
} from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { openConfirmModal } from '@mantine/modals'
import { showNotification } from '@mantine/notifications'
import { IconBell, IconChevronRight, IconUserMinus } from '@tabler/icons'
import { Fragment } from 'react'
import { useNavigate } from 'react-router-dom'

interface QueueTableProps {
	data?: CheckupQueue
	isLoading?: boolean
}

const statusColors: Record<number, string> = {
	[CheckupRecordStatus.CHECKED_IN]: 'green',
	[CheckupRecordStatus.DANG_KHAM]: 'orange',
	[CheckupRecordStatus.CHECKED_IN_SAU_XN]: 'blue',
}

export function QueueTable({ data, isLoading }: QueueTableProps) {
	const theme = useMantineTheme()
	const matches = useMediaQuery(`(max-width: ${theme.breakpoints.md}px)`)
	const navigate = useNavigate()
	const [confirmQueueCheckupById, { isLoading: isLoadingConfirm }] =
		useConfirmCheckupFromQueueByIdMutation()
	const [notifyPatientMutation, { isLoading: isLoadingNotify }] =
		useNotifyPatientMutation()
	const [removeFromQueueMutation, { isLoading: isLoadingRemove }] =
		useRemoveFromQueueMutation()

	const authData = useAppSelector(selectAuth)

	const openModal = (patientName: string, queueId: number) =>
		openConfirmModal({
			title: 'Xác nhận khám bệnh',
			children: (
				<Text size="sm">
					Bạn sẽ khám người bệnh{' '}
					<Text color="green" inherit component="span">
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
	const handleNotifyPatient = async (queueId: number) => {
		await notifyPatientMutation(queueId)
			.unwrap()
			.then((payload) =>
				showNotification({
					title: 'Thông báo thành công',
					message: 'Thông báo đã được gửi đến người bệnh',
				})
			)
			.catch((error) =>
				showNotification({
					title: 'Lỗi thông báo',
					message: 'Không thành công.',
					color: 'red',
				})
			)
	}

	const handleRemovePatient = async (patientName: string, queueId: number) => {
		openConfirmModal({
			title: 'Xóa khỏi hàng chờ',
			children: (
				<Stack spacing={'xs'}>
					<Text size="sm">
						Bạn sẽ xóa người bệnh{' '}
						<Text color="red" inherit component="span">
							{patientName}
						</Text>{' '}
						khỏi hàng chờ.
					</Text>
					<Text size="sm">Vui lòng tiếp tục để xác nhận.</Text>
				</Stack>
			),
			centered: true,
			color: 'red',
			labels: { confirm: 'Xác nhận', cancel: 'Hủy' },
			confirmProps: {
				color: 'red',
			},
			onConfirm: () => handleConfirmRemoveQueue(queueId),
		})
	}
	const handleConfirmRemoveQueue = async (queueId: number) => {
		if (!authData?.information) return
		await removeFromQueueMutation({
			checkupRecordId: queueId,
			roomId: authData?.information?.room?.id,
		})
			.unwrap()
			.then((payload) =>
				showNotification({
					title: 'Đã xóa khỏi hàng chờ',
					message: '',
				})
			)
			.catch((error) =>
				showNotification({
					title: 'Lỗi',
					message: 'Không thành công.',
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
				align={'center'}
				py="sm"
			>
				<Grid.Col span={1} sx={{ textAlign: 'center' }}>
					{item.numericalOrder}
				</Grid.Col>
				<Grid.Col span={3}>
					<Text size="sm" weight={500}>
						{item.patientName}
					</Text>
				</Grid.Col>

				<Grid.Col span={2} sx={{ textAlign: 'center' }}>
					<Badge color={statusColors[item.status]} variant={'light'}>
						{translateCheckupRecordStatus(item.status, item.isReExam)}
					</Badge>
				</Grid.Col>

				<Grid.Col span={1}>
					<Text align="center">
						{formatDate(item?.estimatedStartTime, 'HH:mm')}
					</Text>
				</Grid.Col>
				<Grid.Col span={1}>
					<Text align="center">{formatDate(item?.checkinTime, 'HH:mm')}</Text>
				</Grid.Col>
				<Grid.Col span={1}>
					<Text align="center">
						<Badge
							size="md"
							color={
								item?.session == 0
									? 'green'
									: item?.session == 1
									? 'blue'
									: 'orange'
							}
							variant="outline"
						>
							{translateSession(item?.session)}
						</Badge>
					</Text>
				</Grid.Col>
				<Grid.Col span={3}>
					<Group align={'center'} position="right">
						<Tooltip label="Xóa khỏi hàng chờ">
							<ActionIcon
								onClick={() => handleRemovePatient(item.patientName, item.id)}
								color="red"
							>
								<IconUserMinus />
							</ActionIcon>
						</Tooltip>
						<Tooltip label="Thông báo đến khám">
							<ActionIcon onClick={() => handleNotifyPatient(item.id)}>
								<IconBell />
							</ActionIcon>
						</Tooltip>
						<Button
							variant={isInProgress ? 'outline' : 'filled'}
							rightIcon={isInProgress ? <IconChevronRight /> : null}
							color="green"
							onClick={() => {
								if (isInProgress) {
									navigate(`/${item.id}`)
									return
								}
								openModal(item.patientName, item.id)
							}}
							sx={{ width: 120 }}
						>
							{isInProgress ? 'Tiếp tục khám' : 'Khám bệnh'}
						</Button>
					</Group>
				</Grid.Col>
			</Grid>
		)
	})

	return (
		<>
			<Grid color="gray.1" pb="md" sx={{ width: '100%', fontWeight: 500 }}>
				<Grid.Col span={1} sx={{ textAlign: 'center' }}>
					SKB
				</Grid.Col>
				<Grid.Col span={3}>Tên người bệnh</Grid.Col>
				<Grid.Col span={2} sx={{ textAlign: 'center' }}>
					Trạng thái
				</Grid.Col>
				<Grid.Col span={1}>
					<Text align="center">Dự kiến</Text>
				</Grid.Col>
				<Grid.Col span={1}>
					<Text align="center">Checkin</Text>
				</Grid.Col>
				<Grid.Col span={1}>
					<Text align="center">Ca</Text>
				</Grid.Col>
				<Grid.Col span={3}></Grid.Col>
			</Grid>
			<ScrollArea sx={{ height: 450, width: '100%' }}>
				<Center
					sx={{
						height: 100,
						width: '100%',
						display: isLoading ? 'flex' : 'none',
					}}
				>
					<Loader size="lg" />
				</Center>
				<Stack sx={{ width: '100%', minWidth: 720 }} mt="sm">
					<LoadingOverlay visible={isLoadingConfirm || isLoadingRemove} />
					{rows}
				</Stack>
			</ScrollArea>
		</>
	)
}
