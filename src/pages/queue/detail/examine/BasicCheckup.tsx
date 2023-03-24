import { Icd } from '@/entities/icd'
import { CheckupFormData } from '@/entities/record'
import {
	useGetCheckupRecordByIdQuery,
	useGetIcdListQuery,
} from '@/store/record/api'
import { useUpdateCheckupRecordByIdMutation } from '@/store/record/api'
import { useEffect } from 'react'

import {
	Stack,
	Title,
	Grid,
	NumberInput,
	Divider,
	Text,
	Textarea,
	LoadingOverlay,
	Paper,
	MultiSelect,
} from '@mantine/core'

import { useForm } from '@mantine/form'
import { showNotification } from '@mantine/notifications'
import { IconTemperatureCelsius } from '@tabler/icons'
import { useParams } from 'react-router-dom'
import useGlobalStyles from '@/utils/useGlobalStyles'

type BasicCheckupProps = {
	updateProgress: () => void
}
const BasicCheckup = ({ updateProgress }: BasicCheckupProps) => {
	const { classes: globalClasses, cx: cxGlobal } = useGlobalStyles()
	const { data, isLoading } = useGetIcdListQuery()
	const { id: queueId } = useParams()
	const { data: checkupData, isSuccess: isCheckupDataSuccess } =
		useGetCheckupRecordByIdQuery(Number(queueId), {
			skip: !queueId,
			refetchOnMountOrArgChange: true,
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
			icdDiseaseIds: undefined,
		},
		validateInputOnChange: true,
		validate: {
			pulse: (value: number) =>
				Number(value) < 0 || Number(value) > 200 ? true : null,
			bloodPressure: (value: number) =>
				Number(value) < 0 || Number(value) > 200 ? true : null,
			temperature: (value: number) =>
				Number(value) < 0 || Number(value) > 200 ? true : null,
		},
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

		await updateRecordMutation({
			...values,
			id: checkupData.id,
			patientId: checkupData.patientId,
		})
			.unwrap()
			.then(() => {
				showNotification({
					title: 'Cập nhật chẩn đoán thành công',
					message: <Text>Thông tin chẩn đoán đã được cập nhật.</Text>,
				})
				updateProgress()
			})
	}

	useEffect(() => {
		if (isCheckupDataSuccess) {
			form.setValues({
				bloodPressure: checkupData?.bloodPressure,
				pulse: checkupData?.pulse,
				temperature: checkupData?.temperature,
				doctorAdvice: checkupData?.doctorAdvice ?? '',
				diagnosis: checkupData?.diagnosis ?? '',
				icdDiseaseIds: checkupData?.icdDiseases?.map(
					(item) => item.icdDiseaseId
				),
			})
		}
	}, [isCheckupDataSuccess, checkupData])

	return (
		<Stack mt={'md'}>
			<Stack>
				<Stack>
					<Title order={3} size="h6">
						Triệu chứng
					</Title>
					<Paper>
						<Text>{checkupData?.clinicalSymptom ?? '---'}</Text>
					</Paper>
					<Divider />
				</Stack>

				<form onSubmit={form.onSubmit(onSubmit)} id="form">
					<LoadingOverlay visible={isLoadingUpdateRecord} />
					<Grid gutter="xl">
						<Grid.Col span={3}>
							<NumberInput
								label="Cân nặng"
								placeholder="vd. 6"
								size="sm"
								className={cxGlobal(globalClasses.numberInput, {
									[globalClasses.width60]: true,
								})}
								rightSectionWidth={60}
								rightSection={
									<Text px="sm" color="gray">
										kg
									</Text>
								}
								{...form.getInputProps('bloodPressure')}
							/>
						</Grid.Col>
						<Grid.Col span={3}>
							<NumberInput
								label="Chiều cao"
								placeholder="vd. 100"
								size="sm"
								className={cxGlobal(globalClasses.numberInput, {
									[globalClasses.width60]: true,
								})}
								rightSectionWidth={60}
								rightSection={
									<Text px="sm" color="gray">
										cm
									</Text>
								}
								{...form.getInputProps('pulse')}
							/>
						</Grid.Col>
						<Grid.Col span={3}>
							<NumberInput
								label="Nhiệt độ"
								placeholder="vd. 37.5"
								size="sm"
								className={cxGlobal(globalClasses.numberInput, {
									[globalClasses.width60]: true,
								})}
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
							<MultiSelect
								size="sm"
								label="Chẩn đoán"
								placeholder="Chọn chẩn đoán phù hợp"
								data={
									data?.map((item: Icd) => ({
										value: item.id,
										label: `${item.code} - ${item.name}`,
										...item,
									})) ?? []
								}
								searchable
								nothingFound="Không có dữ liệu"
								{...form.getInputProps('icdDiseaseIds')}
							/>
						</Grid.Col>
						<Grid.Col span={6}>
							<Textarea
								label="Biểu hiện lâm sàng"
								placeholder="Vd. Đau nhẹ"
								autosize
								minRows={2}
								maxRows={4}
								{...form.getInputProps('diagnosis')}
							/>
						</Grid.Col>
						<Grid.Col span={6}>
							<Textarea
								label="Ghi chú thêm"
								placeholder="Vd. Bé có thể tái khám ngay nếu vẫn còn biểu hiện"
								autosize
								minRows={2}
								maxRows={4}
								{...form.getInputProps('doctorAdvice')}
							/>
						</Grid.Col>
						{/*
						<Grid.Col span={12}>
							<Center>
								<Button type="submit">Lưu kết quả</Button>
							</Center>
						</Grid.Col> */}
					</Grid>
				</form>
			</Stack>
		</Stack>
	)
}

export default BasicCheckup
