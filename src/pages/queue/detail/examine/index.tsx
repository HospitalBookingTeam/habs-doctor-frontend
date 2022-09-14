import { Tabs } from '@mantine/core'
import {
	IconPhoto,
	IconReportMedical,
	IconSettings,
	IconPill,
	IconDots,
	IconCalendar,
} from '@tabler/icons'
import BasicCheckup from './BasicCheckup'
import Medication from './Medication'
import Reschedule from './Reschedule'

const ExamineTabs = () => {
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
		</Tabs>
	)
}
export default ExamineTabs
