import RowWithLabel from '@/components/Row'
import { Operation } from '@/entities/operation'
import { ReExamCheckup } from '@/entities/record'
import { useGetOperationListQuery } from '@/store/record/api'
import { formatDate } from '@/utils/formats'
import { Stack, Text } from '@mantine/core'

const ReExamNote = ({ date, note, operationIds }: ReExamCheckup) => {
	const { data: operationList } = useGetOperationListQuery()

	const operationOptions = operationList?.reduce((prev: Operation[], cur) => {
		return [
			...prev,
			...cur.data.map((_item) => ({
				..._item,
			})),
		]
	}, [])

	return (
		<Stack>
			<Text weight={'bold'}>Thông tin tái khám</Text>
			<RowWithLabel
				label="Thời gian"
				content={date ? formatDate(date) : '---'}
			/>
			<RowWithLabel
				label="Yêu cầu xét nghiệm trước"
				content={operationOptions
					?.filter((item) => operationIds?.includes(item.id))
					?.map((item) => item.name)
					?.join(', ')}
				isOdd
			/>
			<RowWithLabel label="Lưu ý" content={note ?? '---'} />
		</Stack>
	)
}
export default ReExamNote
