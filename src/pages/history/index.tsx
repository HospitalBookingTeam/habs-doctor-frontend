import BackButton from '@/components/Button/BackButton'
import { useGetCheckupRecordByIdQuery } from '@/store/record/api'
import { formatDate } from '@/utils/formats'
import { Paper, Stack, Divider, Text, Badge } from '@mantine/core'
import { useParams } from 'react-router-dom'
import PatientInfo from '../queue/detail/record/PatientInfo'
import HistoryRecord from './HistoryRecord'

const RecordHistory = () => {
	const { id: recordId } = useParams()
	const { data: recordData } = useGetCheckupRecordByIdQuery(Number(recordId), {
		skip: !recordId,
	})

	console.log('recordData', recordData)
	return (
		<Stack>
			<Stack
				sx={{ flexDirection: 'row', width: '100%' }}
				align="center"
				justify={'space-between'}
				mb="sm"
				spacing={40}
			>
				<BackButton />

				<Badge size="xl" radius="md">
					LỊCH SỬ KHÁM BỆNH
				</Badge>
			</Stack>
			<Paper p="md">
				<Stack>
					<Text>
						Thời gian:{' '}
						<Text span color="green">
							{recordData?.date ? formatDate(recordData.date) : '---'}
						</Text>
					</Text>
					<Divider />
					<PatientInfo data={recordData?.patientData} />
					<Divider />
					<HistoryRecord data={recordData} />
				</Stack>
			</Paper>
		</Stack>
	)
}
export default RecordHistory
