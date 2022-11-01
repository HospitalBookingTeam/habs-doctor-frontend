import TestRecordList from '@/components/Record/TestRecordList'
import {
	useGetCheckupRecordByIdQuery,
	useGetReExamTreeQuery,
} from '@/store/record/api'
import { LoadingOverlay, Tabs } from '@mantine/core'
import {
	IconReportMedical,
	IconPill,
	IconCalendar,
	IconMedicalCross,
	IconTree,
} from '@tabler/icons'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import BasicCheckup from './BasicCheckup'
import Medication from './Medication'
import PatientRecordTree from './PatientRecordTree'
import Reschedule from './Reschedule'

const ExamineTabs = () => {
	const [activeTab, setActiveTab] = useState<string | null>('gallery')

	const { id: queueId } = useParams()
	const { data, isLoading } = useGetCheckupRecordByIdQuery(Number(queueId), {
		refetchOnFocus: true,
		skip: !queueId,
	})

	const { data: reExamTree, isLoading: isLoadingReExamTree } =
		useGetReExamTreeQuery(data?.reExamTreeCode as string, {
			skip: !data?.reExamTreeCode || activeTab !== 'reExamTree',
		})

	return (
		<Tabs value={activeTab} onTabChange={setActiveTab}>
			<Tabs.List grow>
				<Tabs.Tab value="gallery" icon={<IconReportMedical size={14} />}>
					Chẩn đoán cơ bản
				</Tabs.Tab>
				<Tabs.Tab value="messages" icon={<IconPill size={14} />}>
					Kê thuốc
				</Tabs.Tab>
				<Tabs.Tab value="settings" icon={<IconCalendar size={14} />}>
					Hẹn lịch tái khám
				</Tabs.Tab>
				<Tabs.Tab
					value="testRecords"
					icon={<IconMedicalCross size={14} />}
					sx={{
						display: data?.testRecords?.length ? 'flex' : 'none',
					}}
				>
					Kết quả xét nghiệm
				</Tabs.Tab>
				<Tabs.Tab value="reExamTree" icon={<IconTree size={14} />}>
					Chuỗi khám
				</Tabs.Tab>
			</Tabs.List>

			<Tabs.Panel value="gallery" pt="xs">
				<BasicCheckup />
			</Tabs.Panel>

			<Tabs.Panel value="messages" pt="xs">
				<Medication />
			</Tabs.Panel>

			<Tabs.Panel value="settings" pt="xs">
				<Reschedule />
			</Tabs.Panel>

			<Tabs.Panel value="testRecords" pt="xs">
				<TestRecordList showTitle={false} data={data?.testRecords} />
			</Tabs.Panel>
			<Tabs.Panel value="reExamTree" pt="xs" sx={{ position: 'relative' }}>
				<LoadingOverlay visible={isLoading || isLoadingReExamTree} />
				<PatientRecordTree data={reExamTree} />
			</Tabs.Panel>
		</Tabs>
	)
}
export default ExamineTabs
