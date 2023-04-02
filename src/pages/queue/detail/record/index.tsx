import {
	useGetCheckupRecordByIdQuery,
	useGetReExamTreeByPatientIdQuery,
} from '@/store/record/api'
import { useGetCheckupRecordByPatientIdQuery } from '@/store/record/api'
import {
	Divider,
	Group,
	Title,
	Stack,
	Switch,
	LoadingOverlay,
} from '@mantine/core'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import PatientInfo from './PatientInfo'
import PatientRecords from './PatientRecords'
import PatientRecordTree from '../examine/PatientRecordTree'

const PatientRecord = () => {
	const { id: queueId } = useParams()
	const [checked, setChecked] = useState(false)

	const [pageIndex, setPageIndex] = useState(1)
	const [pageSize, setPageSize] = useState(5)

	const { data } = useGetCheckupRecordByIdQuery(Number(queueId), {
		skip: !queueId,
	})
	const { data: recordData, isLoading: isLoadingRecords } =
		useGetCheckupRecordByPatientIdQuery(
			{
				patientId: data?.patientId,
				pageIndex,
				pageSize,
			},
			{
				skip: !data?.patientId,
			}
		)

	const {
		data: reExamTree,
		isLoading: isLoadingReExamTree,
		isSuccess: isSuccessReExamTree,
	} = useGetReExamTreeByPatientIdQuery(data?.patientId?.toString() as string, {
		skip: !data?.patientId || !checked,
	})

	return (
		<Stack sx={{ gap: 40 }} p="sm">
			<PatientInfo data={data?.patientData} />

			<Divider />

			<Stack>
				<Group position="apart">
					<Title order={3} size="h4">
						Lịch sử khám bệnh
					</Title>
					<Switch
						checked={checked}
						label="Xem dưới dạng chuỗi khám"
						onChange={(event) => setChecked(event.currentTarget.checked)}
					/>
				</Group>
				<Stack>
					{checked && isSuccessReExamTree ? (
						<>
							{reExamTree?.map((item) => (
								<PatientRecordTree data={item} key={item.id} />
							))}
						</>
					) : (
						<>
							<PatientRecords data={recordData?.data} />
						</>
					)}
					<LoadingOverlay visible={isLoadingReExamTree || isLoadingRecords} />
				</Stack>
			</Stack>
		</Stack>
	)
}
export default PatientRecord
