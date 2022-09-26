import { Operation } from '@/entities/operation'
import { CheckupQueue, CheckupQueueItem } from '@/entities/queue'
import { useConfirmCheckupFromQueueByIdMutation } from '@/store/queue/api'
import { formatCurrency } from '@/utils/formats'
import {
	CheckupRecordStatus,
	renderEnumInsuranceStatus,
} from '@/utils/renderEnums'
import {
	Badge,
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
import { Fragment } from 'react'
import { useNavigate } from 'react-router-dom'

interface OperationTableProps {
	data?: Operation[]
}

const OperationsTable = ({ data }: OperationTableProps) => {
	const theme = useMantineTheme()

	const rows = data?.map((item, index) => {
		const isEven = index % 2 === 0

		return (
			<Grid
				key={item.id}
				sx={{ backgroundColor: isEven ? 'white' : 'whitesmoke', width: '100%' }}
				py="sm"
			>
				<Grid.Col span={1} sx={{ textAlign: 'center' }}>
					{index + 1}
				</Grid.Col>
				<Grid.Col span={4}>
					<Text size="sm" weight={500}>
						{item.name}
					</Text>
				</Grid.Col>

				<Grid.Col span={2}>
					<Badge
						// color={jobColors[item.status.toLowerCase()]}
						variant={theme.colorScheme === 'dark' ? 'light' : 'outline'}
					>
						{renderEnumInsuranceStatus(item.insuranceStatus)}
					</Badge>
				</Grid.Col>

				<Grid.Col span={3}>
					<Text>{item.note}</Text>
				</Grid.Col>
				<Grid.Col span={2}>
					<Text>{formatCurrency(item.price)}</Text>
				</Grid.Col>
			</Grid>
		)
	})

	const totalPrice = data?.reduce((prev, curr) => {
		return Number(Number(prev + Number(curr.price)).toFixed(0))
	}, 0)

	return (
		<>
			<Grid color="gray.1" sx={{ width: '100%' }}>
				<Grid.Col span={1} sx={{ textAlign: 'center' }}>
					STT
				</Grid.Col>
				<Grid.Col span={4}>Tên XN</Grid.Col>
				<Grid.Col span={2}>BHYT</Grid.Col>
				<Grid.Col span={3}>Ghi chú</Grid.Col>
				<Grid.Col span={2}>Giá</Grid.Col>
			</Grid>
			<ScrollArea.Autosize maxHeight={300}>
				<Stack sx={{ width: '100%' }} mt="md">
					{rows}
				</Stack>
			</ScrollArea.Autosize>
			<Grid sx={{ width: '100%' }}>
				<Grid.Col span={2} offset={8}>
					<Text>Tổng cộng:</Text>
				</Grid.Col>
				<Grid.Col span={2}>
					<Text weight={700}>{formatCurrency(totalPrice ?? 0)}</Text>
				</Grid.Col>
			</Grid>
		</>
	)
}

export default OperationsTable
