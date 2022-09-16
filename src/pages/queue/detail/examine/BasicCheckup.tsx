import { Icd } from '@/entities/icd'
import { CheckupFormData } from '@/entities/record'
import {
	useGetCheckupRecordByIdQuery,
	useGetIcdListQuery,
} from '@/store/queue/api'
import { useUpdateCheckupRecordByIdMutation } from '@/store/record/api'
import { useEffect } from 'react'

import {
	Stack,
	Title,
	Grid,
	Box,
	Select,
	NumberInput,
	Divider,
	Text,
	Textarea,
	Button,
	Center,
	LoadingOverlay,
} from '@mantine/core'

import { useForm } from '@mantine/form'
import { showNotification } from '@mantine/notifications'
import { IconTemperatureCelsius } from '@tabler/icons'
import { useParams } from 'react-router-dom'

const BasicCheckup = () => {
	const { data, isLoading } = useGetIcdListQuery()
	const { id: queueId } = useParams()
	const { data: checkupData, isSuccess: isCheckupDataSuccess } =
		useGetCheckupRecordByIdQuery(Number(queueId), {
			skip: !queueId,
		})

	const [updateRecordMutation, { isLoading: isLoadingUpdateRecord }] =
		useUpdateCheckupRecordByIdMutation()

	const form = useForm<CheckupFormData>({
		initialValues: {
			bloodPressure: undefined,
			pulse: undefined,
			temperature: undefined,
			doctorAdvice: '',
			diagnosis: '',
			icdDiseaseId: undefined,
		},

		validate: {},
	})

	const onSubmit = async (values: CheckupFormData) => {
		if (!checkupData) {
			showNotification({
				title: 'Thông tin người bệnh không tồn tại',
				message: <Text>Vui lòng kiểm tra lại thông tin khám bệnh.</Text>,
				color: 'red',
			})
			return
		}
		console.log('values', values)
		await updateRecordMutation({
			...values,
			id: checkupData.id,
			patientId: checkupData.patientId,
		})
			.unwrap()
			.then(() =>
				showNotification({
					title: 'Cập nhật chẩn đoán thành công',
					message: <Text>Thông tin chẩn đoán đã được cập nhật.</Text>,
				})
			)
	}

	useEffect(() => {
		if (isCheckupDataSuccess) {
			form.setValues({
				bloodPressure: checkupData?.bloodPressure,
				pulse: checkupData?.pulse,
				temperature: checkupData?.temperature,
				doctorAdvice: checkupData?.doctorAdvice,
				diagnosis: checkupData?.diagnosis,
				icdDiseaseId: checkupData?.icdDiseaseId,
			})
		}
	}, [isCheckupDataSuccess, checkupData, form])

	return (
		<Stack mt={'md'}>
			<Stack>
				<Title order={3} size="h6">
					Chỉ số đo
				</Title>

				<form onSubmit={form.onSubmit(onSubmit)}>
					<LoadingOverlay visible={isLoadingUpdateRecord} />
					<Grid gutter="xl">
						<Grid.Col span={4}>
							<NumberInput
								label="Nhịp tim"
								placeholder="vd. 100"
								size="sm"
								rightSectionWidth={60}
								rightSection={
									<Text px="sm" color="gray">
										BPM
									</Text>
								}
								{...form.getInputProps('bloodPressure')}
							/>
						</Grid.Col>
						<Grid.Col span={4}>
							<NumberInput
								label="Huyết áp"
								placeholder="vd. 100"
								size="sm"
								rightSectionWidth={60}
								rightSection={
									<Text px="sm" color="gray">
										mmHg
									</Text>
								}
								{...form.getInputProps('pulse')}
							/>
						</Grid.Col>
						<Grid.Col span={4}>
							<NumberInput
								label="Nhiệt độ"
								placeholder="vd. 37.5"
								size="sm"
								precision={1}
								rightSectionWidth={60}
								rightSection={
									<IconTemperatureCelsius color="gray" stroke={1} />
								}
								{...form.getInputProps('temperature')}
							/>
						</Grid.Col>

						<Grid.Col span={12}>
							<Divider />
						</Grid.Col>

						<Grid.Col span={12}>
							<Select
								size="sm"
								label="Chẩn đoán"
								placeholder="Pick one"
								data={
									data?.map((item: Icd) => ({
										value: item.id,
										label: `${item.code} - ${item.name}`,
										...item,
									})) ?? []
								}
								searchable
								nothingFound="Không có dữ liệu"
								{...form.getInputProps('icdDiseaseId')}
							/>
						</Grid.Col>
						<Grid.Col span={6}>
							<Textarea
								label="Chẩn đoán cận lâm sàng"
								placeholder="Vd. Đau họng"
								autosize
								minRows={2}
								maxRows={4}
								{...form.getInputProps('diagnosis')}
							/>
						</Grid.Col>
						<Grid.Col span={6}>
							<Textarea
								label="Lời khuyên"
								placeholder="Vd. Uống nước"
								autosize
								minRows={2}
								maxRows={4}
								{...form.getInputProps('doctorAdvice')}
							/>
						</Grid.Col>

						<Grid.Col span={12}>
							<Center>
								<Button type="submit">Lưu kết quả</Button>
							</Center>
						</Grid.Col>
					</Grid>
				</form>
			</Stack>
		</Stack>
	)
}

export default BasicCheckup
