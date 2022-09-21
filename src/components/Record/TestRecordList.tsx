import { TestRecord } from '@/entities/record'
import { formatDate } from '@/utils/formats'
import { Button, Group, Paper, Stack, Text, Title } from '@mantine/core'
import { IconExternalLink } from '@tabler/icons'
import RowWithLabel from '../Row'

const TestRecordList = ({
	data,
	showTitle = true,
}: {
	data?: TestRecord[]
	showTitle?: boolean
}) => {
	return (
		<Stack>
			<Title sx={{ display: showTitle ? 'block' : 'none' }} order={3} size="h4">
				Thông tin xét nghiệm
			</Title>
			{data?.map((item) => (
				<TestRecordRow key={item.id} item={item} />
			))}
		</Stack>
	)
}

const TestRecordRow = ({ item }: { item: TestRecord }) => (
	<Paper key={item.id} withBorder={true} shadow="sm" p="sm">
		<Stack>
			<Group position="apart" grow>
				<Text weight={500}>{item.operationName}</Text>
				<Button
					sx={{ maxWidth: 200 }}
					component="a"
					href={item.resultFileLink}
					target="_blank"
					variant="subtle"
					leftIcon={<IconExternalLink size={14} />}
				>
					Xem chi tiết
				</Button>
			</Group>
			<RowWithLabel label="Bác sĩ" content={item.doctorName} />
			<RowWithLabel
				label="Địa điểm"
				content={`Phòng ${item.roomNumber} - Tầng ${item.floor}`}
			/>
			<RowWithLabel label="Thời gian" content={formatDate(item.date)} />
		</Stack>
	</Paper>
)

export default TestRecordList
