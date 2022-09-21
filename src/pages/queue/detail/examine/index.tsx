import TestRecordList from '@/components/Record/TestRecordList'
import { useGetCheckupRecordByIdQuery } from '@/store/record/api'
import { Tabs } from '@mantine/core'
import {
	IconReportMedical,
	IconPill,
	IconCalendar,
	IconMedicalCross,
} from '@tabler/icons'
import { useParams } from 'react-router-dom'
import BasicCheckup from './BasicCheckup'
import Medication from './Medication'
import Reschedule from './Reschedule'

const ExamineTabs = () => {
	const { id: queueId } = useParams()
	const { data, isLoading } = useGetCheckupRecordByIdQuery(Number(queueId), {
		refetchOnFocus: true,
		skip: !queueId,
	})

	return (
		<Tabs defaultValue="gallery">
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
		</Tabs>
	)
}
export default ExamineTabs
