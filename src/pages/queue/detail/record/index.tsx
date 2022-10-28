import { useGetCheckupRecordByIdQuery } from '@/store/record/api'
import { useGetCheckupRecordByPatientIdQuery } from '@/store/record/api'
import { Divider, Stack } from '@mantine/core'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import PatientInfo from './PatientInfo'
import PatientRecords from './PatientRecords'

const PatientRecord = () => {
	const { id: queueId } = useParams()

	const [pageIndex, setPageIndex] = useState(1)
	const [pageSize, setPageSize] = useState(5)

	const { data } = useGetCheckupRecordByIdQuery(Number(queueId), {
		skip: !queueId,
	})
	const { data: recordData } = useGetCheckupRecordByPatientIdQuery(
		{
			patientId: data?.patientId,
			pageIndex,
			pageSize,
		},
		{
			skip: !data?.patientId,
		}
	)

	return (
		<Stack sx={{ gap: 40 }} p="sm">
			<PatientInfo data={data?.patientData} />

			<Divider />

			<PatientRecords
				data={recordData?.data}
				reExamTreeCode={data?.reExamTreeCode}
			/>
		</Stack>
	)
}
export default PatientRecord
