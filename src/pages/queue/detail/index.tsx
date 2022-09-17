import BackButton from '@/components/Button/BackButton'
import LayoutAppShell from '@/components/Layout'
import { useGetCheckupRecordByIdQuery } from '@/store/queue/api'
import { Badge } from '@mantine/core'
import { Button, Paper, Stack, Tabs, Title, Box } from '@mantine/core'
import { IconId, IconStethoscope } from '@tabler/icons'
import { useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import ExamineTabs from './examine'
import FinishRecord from './examine/modals/FinishRecord'
import RequestDepartments from './examine/modals/RedirectDepartments'
import RequestEmergency from './examine/modals/RequestEmergency'
import RequestOperationsButton from './examine/modals/RequestOperations'
import PatientRecord from './record'

const QueueDetail = () => {
	const { id: queueId } = useParams()
	const { data, isLoading } = useGetCheckupRecordByIdQuery(Number(queueId), {
		refetchOnFocus: true,
		skip: !queueId,
	})
	console.log('data', data)
	const [searchParams, setSearchParams] = useSearchParams()
	const [tabValue, setTabValue] = useState<string | null>(
		searchParams.get('tabs') ?? 'examine'
	)

	return (
		<Stack align={'start'}>
			<Stack
				sx={{ flexDirection: 'row', width: '100%' }}
				align="center"
				justify={'space-between'}
				mb="sm"
				spacing={40}
			>
				<BackButton />

				<Badge size="xl" radius="md">
					Khám bệnh
				</Badge>
			</Stack>
			<Box sx={{ width: '100%' }}>
				<Tabs
					orientation="vertical"
					value={tabValue}
					onTabChange={(value: string) => {
						setTabValue(value)
						setSearchParams({ tabs: value })
					}}
				>
					<Stack sx={{ order: 2, width: 200 }}>
						<Paper p="md">
							<Tabs.List
								sx={{
									borderLeft: '2px solid #dee2e6',
									borderRight: 0,
								}}
							>
								<Tabs.Tab
									value="examine"
									icon={<IconStethoscope size={14} />}
									sx={{
										borderLeft: '2px solid transparent',
										borderRight: 0,
										borderRadius: 0,
										marginRight: 0,
										marginLeft: -2,
									}}
								>
									Nội dung khám
								</Tabs.Tab>
								<Tabs.Tab
									value="record"
									icon={<IconId size={14} />}
									sx={{
										borderLeft: '2px solid transparent',
										borderRight: 0,
										borderRadius: 0,
										marginRight: 0,
										marginLeft: -2,
									}}
								>
									Hồ sơ người bệnh
								</Tabs.Tab>
							</Tabs.List>
						</Paper>
						<Stack align="flex-end" mb="md" sx={{ width: 200 }}>
							<FinishRecord />
							<RequestOperationsButton />
							<RequestDepartments />
							<RequestEmergency />
						</Stack>
					</Stack>

					<Tabs.Panel value="examine" pr="lg">
						<Paper p="md">
							<ExamineTabs />
						</Paper>
					</Tabs.Panel>

					<Tabs.Panel value="record" pr="lg">
						<Paper p="md">
							<PatientRecord />
						</Paper>
					</Tabs.Panel>
				</Tabs>
			</Box>
			{/* </Paper> */}
		</Stack>
	)
}
export default QueueDetail

//TODO: Verify whether the doctor can start treatment for this patient. If the patient is not confirmed.
