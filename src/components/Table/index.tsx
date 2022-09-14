import { CheckupQueue, CheckupQueueItem } from '@/entities/queue'
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
	Loader,
} from '@mantine/core'
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

	const rows = data?.map((item) => (
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
				<Group spacing={'md'} position="right">
					<Button
						variant="gradient"
						gradient={{ from: 'teal', to: 'lime', deg: 105 }}
						onClick={() => {
							navigate(`/${item.id}`)
						}}
					>
						Khám bệnh
					</Button>
					<Button color="cyan">Xem hồ sơ</Button>
				</Group>
			</Grid.Col>
			<Grid.Col span={12}>
				<Divider />
			</Grid.Col>
		</Fragment>
	))

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
				<Grid.Col span={2} sx={{ textAlign: 'center' }}>
					Tái khám
				</Grid.Col>
				<Grid.Col span={3}></Grid.Col>
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
