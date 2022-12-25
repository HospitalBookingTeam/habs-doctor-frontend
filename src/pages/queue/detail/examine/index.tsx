import { Stepper, Group, Button, Center } from '@mantine/core'
import { useEffect, useState } from 'react'
import BasicCheckup from './BasicCheckup'
import Medication from './Medication'
import RequestOperations from './RequestOperations'
import Reschedule from './Reschedule'
import { useGetCheckupRecordByIdQuery } from '@/store/record/api'
import { useParams } from 'react-router-dom'

const ExamineTabs = () => {
	const [active, setActive] = useState(0)
	const [isMounted, setIsMounted] = useState(false)
	const nextStep = () =>
		setActive((current) => (current < 4 ? current + 1 : current))
	const prevStep = () =>
		setActive((current) => (current > 0 ? current - 1 : current))

	const isSkip = active === 1 || active === 3

	const { id: queueId } = useParams()
	const { data: checkupData } = useGetCheckupRecordByIdQuery(Number(queueId), {
		skip: !queueId,
	})

	useEffect(() => {
		if (isMounted || !checkupData) return
		if (checkupData?.prescription) {
			setActive(2)
		}
		if (checkupData?.testRecords?.length) {
			setActive(1)
		}
		setIsMounted(true)
	}, [checkupData, isMounted])

	return (
		// <Tabs value={activeTab} onTabChange={setActiveTab}>
		// 	<Tabs.List grow>
		// 		<Tabs.Tab value="gallery" icon={<IconReportMedical size={14} />}>
		// 			Chẩn đoán cơ bản
		// 		</Tabs.Tab>
		// 		<Tabs.Tab value="messages" icon={<IconPill size={14} />}>
		// 			Kê thuốc
		// 		</Tabs.Tab>
		// 		<Tabs.Tab value="settings" icon={<IconCalendar size={14} />}>
		// 			Hẹn lịch tái khám
		// 		</Tabs.Tab>

		// 	</Tabs.List>

		// 	<Tabs.Panel value="gallery" pt="xs">
		// 		<BasicCheckup />
		// 	</Tabs.Panel>

		// 	<Tabs.Panel value="messages" pt="xs">
		// 		<Medication />
		// 	</Tabs.Panel>

		// 	<Tabs.Panel value="settings" pt="xs">
		// 		<Reschedule />
		// 	</Tabs.Panel>
		// </Tabs>

		<>
			<Stepper active={active} onStepClick={setActive} breakpoint="sm">
				<Stepper.Step
					label="Chẩn đoán cơ bản"
					// description="Khám cơ bản"
					allowStepSelect={active > 0}
				>
					<BasicCheckup updateProgress={nextStep} />
				</Stepper.Step>
				<Stepper.Step
					label="Yêu cầu xét nghiệm"
					// description="Xét nghiệm"
					allowStepSelect={active > 1}
				>
					<RequestOperations updateProgress={nextStep} />
				</Stepper.Step>
				<Stepper.Step label="Kê thuốc" allowStepSelect={active > 2}>
					<Medication updateProgress={nextStep} />
				</Stepper.Step>
				<Stepper.Step label="Hẹn tái khám" allowStepSelect={active > 3}>
					<Reschedule updateProgress={nextStep} />
				</Stepper.Step>
				<Stepper.Completed>
					<Center pt="xl">
						Đã hoàn thành nhập liệu. Bạn có thể quay lại để chỉnh sửa hoặc hoàn
						thành khám bệnh.
					</Center>
				</Stepper.Completed>
			</Stepper>

			<Group position="center" sx={{ position: 'relative', marginTop: 40 }}>
				<Button variant="default" onClick={prevStep}>
					Quay lại
				</Button>
				{active < 4 && (
					<Button type="submit" form="form">
						Lưu và tiếp tục
					</Button>
				)}

				{isSkip && (
					<Button
						variant="subtle"
						color="blue"
						onClick={nextStep}
						sx={{ position: 'absolute', top: 0, right: 0 }}
					>
						Bỏ qua
					</Button>
				)}
			</Group>
		</>
	)
}
export default ExamineTabs
