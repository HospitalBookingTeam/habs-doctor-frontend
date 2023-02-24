import BackButton from '@/components/Button/BackButton'
import {
	useGetCheckupRecordByIdQuery,
	useGetReExamTreeQuery,
} from '@/store/record/api'
import { Badge, Group, LoadingOverlay, useMantineTheme } from '@mantine/core'
import { Paper, Stack, Tabs, Box } from '@mantine/core'
import { IconId, IconStethoscope, IconTree } from '@tabler/icons'
import { lazy, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import ExamineTabs from './examine'
import FinishRecord from './examine/modals/FinishRecord'
import RequestDepartments from './examine/modals/RedirectDepartments'
import RequestEmergency from './examine/modals/RequestEmergency'
import PatientRecord from './record'
import { useMediaQuery } from '@mantine/hooks'
import PrintDetail from './examine/modals/PrintDetail'

const PatientRecordTree = lazy(() => import('./examine/PatientRecordTree'))

const tabSx = {
	borderLeft: '2px solid transparent',
	borderRight: 0,
	borderRadius: 0,
	marginRight: 0,
	marginLeft: -2,
}

const QueueDetail = () => {
	const [searchParams, setSearchParams] = useSearchParams()
	const [tabValue, setTabValue] = useState<string | null>(
		searchParams.get('tabs') ?? 'examine'
	)
	const theme = useMantineTheme()
	const matches = useMediaQuery(`(max-width: ${theme.breakpoints.md}px)`)

	const { id: queueId } = useParams()
	const { data, isLoading } = useGetCheckupRecordByIdQuery(Number(queueId), {
		refetchOnFocus: true,
		skip: !queueId,
	})

	const { data: reExamTree, isLoading: isLoadingReExamTree } =
		useGetReExamTreeQuery(data?.reExamTreeCode as string, {
			skip: !data?.reExamTreeCode || tabValue !== 'reexamTree',
		})

	const tabs = [
		{
			value: 'examine',
			icon: <IconStethoscope size={14} />,
			title: 'Nội dung khám',
			panel: <ExamineTabs />,
		},
		{
			value: 'record',
			icon: <IconId size={14} />,
			title: 'Hồ sơ người bệnh',
			panel: <PatientRecord />,
		},
		{
			value: 'reexamTree',
			icon: <IconTree size={14} />,
			title: 'Chuỗi khám',
			panel: <PatientRecordTree data={reExamTree} />,
		},
		// {
		// 	value: 'testResults',
		// 	icon: <IconMedicalCross size={14} />,
		// 	title: 'Kết quả xét nghiệm',
		// 	panel: <TestRecordList showTitle={false} data={data?.testRecords} />,
		// },
	]

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
					orientation={matches ? 'horizontal' : 'vertical'}
					value={tabValue}
					onTabChange={(value: string) => {
						setTabValue(value)
						setSearchParams({ tabs: value })
					}}
				>
					<Stack sx={{ order: 2, width: matches ? 'auto' : 200 }}>
						<Paper p="md">
							<Tabs.List
								sx={
									matches
										? {}
										: {
												borderLeft: '2px solid #dee2e6',
												borderRight: 0,
										  }
								}
							>
								{tabs
									.filter(
										(item) =>
											(item.value === 'testResults' &&
												data?.testRecords?.length) ||
											item.value !== 'testResults'
									)
									.map((item) => (
										<Tabs.Tab
											key={item.value}
											value={item.value}
											icon={item.icon}
											sx={matches ? {} : tabSx}
										>
											{item.title}
										</Tabs.Tab>
									))}
							</Tabs.List>
						</Paper>
						<Stack
							sx={{ flexDirection: matches ? 'row' : 'column', width: 200 }}
							align="flex-end"
							mb="md"
						>
							<FinishRecord />
							{/* <RequestOperationsButton /> */}
							<RequestDepartments />
							<RequestEmergency />
							<PrintDetail data={data} />
						</Stack>
					</Stack>

					{tabs
						.filter(
							(item) =>
								(item.value === 'testResults' && data?.testRecords?.length) ||
								item.value !== 'testResults'
						)
						.map((item) => (
							<Tabs.Panel
								key={item.value}
								value={item.value}
								pr="lg"
								sx={{ position: 'relative' }}
							>
								<LoadingOverlay visible={isLoading || isLoadingReExamTree} />
								<Paper p="md">{item.panel}</Paper>
							</Tabs.Panel>
						))}
				</Tabs>
			</Box>
		</Stack>
	)
}
export default QueueDetail

//TODO: Verify whether the doctor can start treatment for this patient. If the patient is not confirmed.
