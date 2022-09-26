import OperationsTable from '@/components/Table/OperationsTable'
import { RequestReExamForm } from '@/entities/record'
import { useGetCheckupRecordByIdQuery } from '@/store/record/api'
import {
	useGetOperationListQuery,
	useRequestReExamByIdMutation,
} from '@/store/record/api'
import {
	Button,
	Stack,
	Textarea,
	MultiSelect,
	Text,
	LoadingOverlay,
} from '@mantine/core'
import { DatePicker } from '@mantine/dates'
import { useForm } from '@mantine/form'
import { showNotification } from '@mantine/notifications'
import { IconCalendar } from '@tabler/icons'
import 'dayjs/locale/vi'
import { useParams } from 'react-router-dom'

const Reschedule = () => {
	const { data: operationList, isLoading: isLoadingOperationList } =
		useGetOperationListQuery()
	const [requestReExamMutation, { isLoading: isLoadingRequestReExamMutation }] =
		useRequestReExamByIdMutation()
	const { id: queueId } = useParams()
	const { data: checkupData, isSuccess: isCheckupDataSuccess } =
		useGetCheckupRecordByIdQuery(Number(queueId), {
			skip: !queueId,
		})

	const form = useForm<RequestReExamForm>({
		initialValues: {
			examOperationIds: [],
			note: '',
			reExamDate: undefined,
		},
		validate: {
			reExamDate: (value: string | undefined) => (!value ? true : null),
		},
	})

	const onSubmit = async (values: RequestReExamForm) => {
		if (!checkupData) {
			showNotification({
				title: 'Thông tin người bệnh không tồn tại',
				message: <Text>Vui lòng kiểm tra lại thông tin khám bệnh.</Text>,
				color: 'red',
			})
			return
		}

		console.log('values', values)
		await requestReExamMutation({
			id: checkupData.id,
			patientId: checkupData.patientId,
			departmentId: checkupData.departmentId,
			requiredTest: {
				examOperationIds: values.examOperationIds,
			},
			note: values.note,
			reExamDate: values.reExamDate,
		})
			.unwrap()
			.then(() =>
				showNotification({
					title: 'Hẹn tái khám thành công',
					message: <Text>Lịch tái khám đã được cập nhật.</Text>,
				})
			)
	}

	return (
		<Stack mt="sm">
			<LoadingOverlay visible={isLoadingRequestReExamMutation} />
			<form onSubmit={form.onSubmit(onSubmit)}>
				<Stack>
					<Stack justify={'space-between'} sx={{ flexDirection: 'row' }}>
						<DatePicker
							locale="vi"
							inputFormat="DD/MM/YYYY"
							placeholder="Chọn ngày dự kiến"
							label="Ngày dự kiến"
							icon={<IconCalendar />}
							withAsterisk={true}
							{...form.getInputProps('reExamDate')}
							sx={{ minWidth: 200 }}
						/>
					</Stack>

					<Stack>
						<MultiSelect
							mt="md"
							size="sm"
							label="Các xét nghiệm yêu cầu"
							placeholder="Chọn xét nghiệm"
							data={
								operationList?.map((item) => ({
									value: item.id,
									label: item.name,
								})) ?? []
							}
							searchable
							nothingFound="Không tìm thấy dữ liệu"
							{...form.getInputProps('examOperationIds')}
						/>

						<OperationsTable
							data={operationList?.filter((item) =>
								form.values.examOperationIds?.includes(item.id)
							)}
						/>
						<Textarea
							label="Ghi chú"
							placeholder="Viết ghi chú cho người bệnh"
							minRows={2}
							maxRows={4}
							sx={{ minWidth: 450 }}
							{...form.getInputProps('note')}
						/>
					</Stack>
				</Stack>
				<Stack align={'center'} my="sm">
					<Button
						type="submit"
						disabled={isLoadingOperationList || !form.isValid()}
					>
						Xác nhận tái khám
					</Button>
				</Stack>
			</form>
		</Stack>
	)
}
export default Reschedule
