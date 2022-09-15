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

const statusColors: Record<string, string> = {
	engineer: 'blue',
	manager: 'cyan',
	designer: 'pink',
}

export function QueueTable({ data, isLoading }: QueueTableProps) {
	console.log('data', data)
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
			onCancel: () => console.log('Cancel'),
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

	const rows = data?.map((item) => {
		const isInProgress =
			item?.status === CheckupRecordStatus.DANG_KHAM ||
			item?.status === CheckupRecordStatus.CHECKED_IN_SAU_XN
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
						<Button
							variant={isInProgress ? 'gradient' : 'filled'}
							color="green"
							gradient={
								isInProgress
									? { from: 'teal', to: 'lime', deg: 105 }
									: undefined
							}
							onClick={() => {
								if (isInProgress) {
									navigate(`/${item.id}`)
									return
								}
								openModal(item.patientName, item.id)
							}}
							sx={{ width: 140 }}
						>
							{isInProgress ? 'Tiếp tục khám' : 'Khám bệnh'}
						</Button>
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
					<LoadingOverlay visible={isLoadingConfirm} />
					{rows}
				</Grid>
			</ScrollArea>
		</>
	)
}
