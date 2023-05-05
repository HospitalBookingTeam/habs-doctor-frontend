import { useState } from 'react'
import BackButton from '@/components/Button/BackButton'
import TestRecordList from '@/components/Record/TestRecordList'
import {
	useGetCheckupRecordByIdQuery,
	useGetReExamTreeQuery,
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
	Group,
	Box,
} from '@mantine/core'
import { useParams } from 'react-router-dom'
import PatientInfo from '../queue/detail/record/PatientInfo'
import HistoryRecord from './HistoryRecord'
import MedicationList from './MedicationList'
import PatientRecordTree from '../queue/detail/examine/PatientRecordTree'
import ReExamNote from './ReExamNote'
import PrintDetail from './PrintDetail'

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
		useGetReExamTreeQuery(recordData?.reExamTreeCode?.toString() as string, {
			skip: !recordData?.reExamTreeCode || activeTab !== 'reExamTree',
		})

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

				<Group>
					<Badge size="xl" radius="md">
						LỊCH SỬ KHÁM BỆNH
					</Badge>
				</Group>
			</Stack>
			<Paper p="md" sx={{ background: 'white' }}>
				<Tabs value={activeTab} onTabChange={setActiveTab}>
					<Tabs.List grow>
						<Tabs.Tab value="record">Thông tin chi tiết</Tabs.Tab>
						<Tabs.Tab value="reExamTree">Chuỗi khám</Tabs.Tab>
					</Tabs.List>
					<Tabs.Panel value="record" pt="xs">
						<Stack>
							<Group position="apart">
								<Text>
									Thời gian:{' '}
									<Text span color="green" weight={'bolder'}>
										{recordData?.date ? formatDate(recordData.date) : '---'}
									</Text>
								</Text>
								<Box sx={{ maxWidth: 150 }}>
									<PrintDetail data={recordData} />
								</Box>
							</Group>
							<Divider />
							<PatientInfo data={recordData?.patientData} />
							<Divider />
							<HistoryRecord data={recordData} />

							{!!recordData?.testRecords?.length && (
								<>
									<Divider />
									<TestRecordList data={recordData?.testRecords} />
								</>
							)}
							{!!recordData?.prescription && (
								<>
									<Divider />
									<MedicationList data={recordData?.prescription} />
								</>
							)}
							{!!recordData?.hasReExam && !!recordData?.reExam && (
								<>
									<Divider />
									<ReExamNote {...recordData?.reExam} />
								</>
							)}
						</Stack>
					</Tabs.Panel>

					<Tabs.Panel value="reExamTree" pt="xs" sx={{ position: 'relative' }}>
						<LoadingOverlay visible={isLoading || isLoadingReExamTree} />
						<Stack sx={{ minHeight: 200 }}>
							<PatientRecordTree data={reExamTree} />
						</Stack>
					</Tabs.Panel>
				</Tabs>
			</Paper>
		</Stack>
	)
}
export default RecordHistory
