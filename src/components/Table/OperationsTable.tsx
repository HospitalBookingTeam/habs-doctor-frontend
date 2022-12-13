import { NewOperation, Operation } from '@/entities/operation'

import { formatCurrency } from '@/utils/formats'
import { renderEnumInsuranceStatus } from '@/utils/renderEnums'
import {
	Badge,
	Text,
	ScrollArea,
	useMantineTheme,
	Grid,
	ActionIcon,
	Stack,
	Paper,
} from '@mantine/core'

import { IconMinus } from '@tabler/icons'

interface OperationTableProps {
	data?: NewOperation[]
	onRemove?: (val: number) => void
	editReExam?: boolean
}

const OperationsTable = ({
	data,
	onRemove,
	editReExam = true,
}: OperationTableProps) => {
	const theme = useMantineTheme()

	const rowsData = data?.reduce(
		(prev: (Operation & { operationTypeName: string })[], cur) => {
			return [
				...prev,
				...cur.data.map((_item) => ({
					..._item,
					operationTypeName: cur.name,
				})),
			]
		},
		[]
	)

	const rows = rowsData?.map((item, index) => {
		return (
			<Grid
				key={item.id}
				sx={{
					backgroundColor:
						index % 2 === 0 ? theme.colors.gray[0] : theme.colors.gray[1],
					width: '100%',
				}}
				p="sm"
			>
				<Grid.Col span={1}>
					<Text size="sm" align="center">
						{index + 1}
					</Text>
				</Grid.Col>
				<Grid.Col span={3}>
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
					<Text align="right">{formatCurrency(item.price)}</Text>
				</Grid.Col>
				<Grid.Col span={1}>
					{editReExam && (
						<ActionIcon
							radius="xl"
							variant="outline"
							onClick={() => onRemove && onRemove(Number(item.id))}
							color="orange"
							sx={{ margin: '0 auto' }}
						>
							<IconMinus />
						</ActionIcon>
					)}
				</Grid.Col>
			</Grid>
		)
	})

	const totalPrice = data?.reduce((prev, curr) => {
		const curPrice = curr.data.reduce(
			(prev, cur) => prev + Number(cur.price),
			0
		)
		return Number(Number(prev + curPrice).toFixed(0))
	}, 0)

	return (
		<Paper withBorder py="sm">
			<Stack>
				<Grid color="gray.1" sx={{ width: '100%', fontWeight: 500 }} px="sm">
					<Grid.Col span={1} sx={{ textAlign: 'center' }}>
						STT
					</Grid.Col>
					<Grid.Col span={3}>Tên XN</Grid.Col>
					<Grid.Col span={2}>BHYT</Grid.Col>
					<Grid.Col span={3}>Ghi chú</Grid.Col>
					<Grid.Col span={2} sx={{ textAlign: 'right' }}>
						Giá
					</Grid.Col>
					<Grid.Col span={1}></Grid.Col>
				</Grid>
				<ScrollArea.Autosize maxHeight={500}>
					<Stack sx={{ width: '100%' }} mt="sm">
						{rows}
					</Stack>
				</ScrollArea.Autosize>
				<Grid sx={{ width: '100%' }} px="sm">
					<Grid.Col span={2} offset={7}>
						<Text>Tổng cộng:</Text>
					</Grid.Col>
					<Grid.Col span={2}>
						<Text weight={700} align="right">
							{formatCurrency(totalPrice ?? 0)}
						</Text>
					</Grid.Col>
				</Grid>
			</Stack>
		</Paper>
	)
}

export default OperationsTable
