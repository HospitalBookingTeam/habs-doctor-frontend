import { useState } from 'react'
import BackButton from '@/components/Button/BackButton'
import TestRecordList from '@/components/Record/TestRecordList'
import {
	useGetCheckupRecordByIdQuery,
	useGetReExamTreeByPatientIdQuery,
} from '@/store/record/api'
import { formatDate } from '@/utils/formats'
import {
	Paper,
	Stack,
	Divider,
	Text,
	Badge,
	Tabs,
	LoadingOverlay,
} from '@mantine/core'
import { useParams } from 'react-router-dom'
import PatientInfo from '../queue/detail/record/PatientInfo'
import HistoryRecord from './HistoryRecord'
import MedicationList from './MedicationList'
import PatientRecordTree from '../queue/detail/examine/PatientRecordTree'

const RecordHistory = () => {
	const [activeTab, setActiveTab] = useState<string | null>('record')
	const { id: recordId } = useParams()
	const { data: recordData, isLoading } = useGetCheckupRecordByIdQuery(
		Number(recordId),
		{
			skip: !recordId,
		}
	)

	const { data: reExamTree, isLoading: isLoadingReExamTree } =
		useGetReExamTreeByPatientIdQuery(
			recordData?.patientId?.toString() as string,
			{
				skip: !recordData?.patientId || activeTab !== 'reExamTree',
			}
		)

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
				<Tabs value={activeTab} onTabChange={setActiveTab}>
					<Tabs.List grow>
						<Tabs.Tab value="record">Thông tin chi tiết</Tabs.Tab>
						<Tabs.Tab value="reExamTree">Chuỗi khám</Tabs.Tab>
					</Tabs.List>
					<Tabs.Panel value="record" pt="xs">
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

							<Divider />
							<TestRecordList data={recordData?.testRecords} />
							<Divider />
							<MedicationList data={recordData?.prescription} />
						</Stack>
					</Tabs.Panel>

					<Tabs.Panel value="reExamTree" pt="xs" sx={{ position: 'relative' }}>
						<LoadingOverlay visible={isLoading || isLoadingReExamTree} />
						<Stack sx={{ minHeight: 200 }}>
							{reExamTree?.map((item) => (
								<PatientRecordTree key={item.id} data={item} />
							))}
						</Stack>
					</Tabs.Panel>
				</Tabs>
			</Paper>
		</Stack>
	)
}
export default RecordHistory
