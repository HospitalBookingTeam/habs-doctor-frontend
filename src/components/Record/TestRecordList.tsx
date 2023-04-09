import { TestRecord } from '@/entities/record'
import { formatDate } from '@/utils/formats'
import {
	Button,
	Group,
	Paper,
	Stack,
	Text,
	Title,
	Spoiler,
} from '@mantine/core'
import { IconExternalLink } from '@tabler/icons'
import RowWithLabel from '../Row'
import { TestRecordStatus } from '@/utils/renderEnums'

const TestRecordList = ({
	data,
	showTitle = true,
	showSpoiler = false,
}: {
	data?: TestRecord[]
	showTitle?: boolean
	showSpoiler?: boolean
}) => {
	return (
		<Stack>
			<Title sx={{ display: showTitle ? 'block' : 'none' }} order={3} size="h4">
				Thông tin xét nghiệm
			</Title>
			{data?.map((item) => (
				<TestRecordRow key={item.id} item={item} showSpoiler={showSpoiler} />
			))}
		</Stack>
	)
}

const TestRecordRow = ({
	item,
	showSpoiler,
}: {
	item: TestRecord
	showSpoiler: boolean
}) => {
	const showFail =
		item?.status === TestRecordStatus.DA_HUY && !!item?.failReason

	const content = (
		<Stack spacing={'sm'}>
			<Group position="apart" grow>
				<Text weight={500}>{item.operationName}</Text>
				<Button
					sx={{ maxWidth: 200 }}
					component="a"
					href={item.resultFileLink}
					target="_blank"
					variant="subtle"
					leftIcon={<IconExternalLink size={14} />}
					disabled={showFail}
				>
					Xem chi tiết
				</Button>
			</Group>
			{showFail ? (
				<RowWithLabel
					label="Lý do hủy"
					content={item?.failReason ?? '---'}
					isOdd
				/>
			) : (
				<RowWithLabel
					label="Kết quả tổng quát"
					content={item?.resultDescription ?? '---'}
					isOdd
				/>
			)}
			<RowWithLabel
				label="Bác sĩ xét nghiệm"
				content={item.doctorName ?? '---'}
			/>
			<RowWithLabel
				label="Địa điểm"
				content={`Phòng ${item.roomNumber} - Tầng ${item.floor}`}
				isOdd
			/>
			<RowWithLabel label="Thời gian" content={formatDate(item.date)} />
		</Stack>
	)
	return (
		<Paper key={item.id} withBorder={true} shadow="sm" p="sm">
			{!showSpoiler ? (
				content
			) : (
				<Spoiler maxHeight={96} showLabel="Mở rộng" hideLabel="Ẩn">
					{content}
				</Spoiler>
			)}
		</Paper>
	)
}

export default TestRecordList
