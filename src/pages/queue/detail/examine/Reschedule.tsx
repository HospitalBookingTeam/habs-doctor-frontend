import React, { useEffect, useState } from 'react'
import OperationsTable from '@/components/Table/OperationsTable'
import { RequestReExamForm } from '@/entities/record'
import {
	useDeleteReExamByIdMutation,
	useGetCheckupRecordByIdQuery,
} from '@/store/record/api'
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
	Group,
	Input,
	TextInput,
} from '@mantine/core'
import { DatePicker } from '@mantine/dates'
import { useForm } from '@mantine/form'
import { showNotification } from '@mantine/notifications'
import { IconCalendar } from '@tabler/icons'
import 'dayjs/locale/vi'
import { useParams } from 'react-router-dom'
import dayjs from 'dayjs'
import { openConfirmModal } from '@mantine/modals'

const Reschedule = () => {
	const { data: operationList, isLoading: isLoadingOperationList } =
		useGetOperationListQuery()
	const [requestReExamMutation, { isLoading: isLoadingRequestReExamMutation }] =
		useRequestReExamByIdMutation()

	const [
		deleteReExamByMutation,
		{ isLoading: isLoadingDeleteReExamByMutation },
	] = useDeleteReExamByIdMutation()

	const { id: queueId } = useParams()
	const {
		data: checkupData,
		isSuccess: isCheckupDataSuccess,
		refetch,
	} = useGetCheckupRecordByIdQuery(Number(queueId), {
		skip: !queueId,
	})

	const [isReExamEditable, setIsReExamEditable] = useState(false)

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

		await requestReExamMutation({
			id: checkupData.id,
			patientId: checkupData.patientId,
			departmentId: checkupData.departmentId,
			requiredTest: {
				examOperationIds: values.examOperationIds,
			},
			note: values.note,
			reExamDate: values?.reExamDate
				? dayjs(values.reExamDate).format('YYYY-MM-DD')
				: undefined,
		})
			.unwrap()
			.then(() => {
				showNotification({
					title: 'Hẹn tái khám thành công',
					message: <Text>Lịch tái khám đã được cập nhật.</Text>,
				})
				refetch()
			})
	}

	const openDeleteModal = () =>
		openConfirmModal({
			title: 'Xác nhận hủy tái khám',
			children: <Text size="sm">Tiếp tục để hủy lịch tái khám hiện tại.</Text>,
			centered: true,
			labels: { confirm: 'Xác nhận', cancel: 'Quay lại' },
			confirmProps: { color: 'red' },
			onConfirm: () => handleConfirmDeleteReExam(),
		})

	const handleConfirmDeleteReExam = async () => {
		if (!checkupData) {
			showNotification({
				title: 'Thông tin người bệnh không tồn tại',
				message: <Text>Vui lòng kiểm tra lại thông tin khám bệnh.</Text>,
				color: 'red',
			})
			return
		}
		await deleteReExamByMutation({ id: checkupData.id })
			.unwrap()
			.then(() => {
				form.setValues({
					examOperationIds: [],
					note: '',
					reExamDate: undefined,
				})
				setIsReExamEditable(true)
				refetch()
			})
			.catch(() =>
				showNotification({
					title: 'Lỗi hủy tái khám',
					message: '',
					color: 'red',
				})
			)
	}

	const resetFormValues = () => {
		form.setValues({
			note: checkupData?.reExam?.note ?? '',
			examOperationIds: checkupData?.reExam?.operationIds,
			reExamDate: checkupData?.reExam?.date
				? new Date(checkupData?.reExam?.date)
				: undefined,
		})
	}

	useEffect(() => {
		if (isCheckupDataSuccess && checkupData?.hasReExam) {
			resetFormValues()
		}
	}, [isCheckupDataSuccess, checkupData])

	const editReExam =
		!checkupData?.hasReExam || (checkupData?.hasReExam && isReExamEditable)

	return (
		<Stack mt="sm">
			<LoadingOverlay
				visible={
					isLoadingRequestReExamMutation || isLoadingDeleteReExamByMutation
				}
			/>
			<form onSubmit={form.onSubmit(onSubmit)}>
				<Stack>
					{checkupData?.hasReExam && (
						<Group position="right">
							<Button
								variant="outline"
								onClick={() => {
									if (isReExamEditable) {
										resetFormValues()
									}
									setIsReExamEditable((checked) => !checked)
								}}
							>
								{isReExamEditable ? 'Hủy bỏ thay đổi' : 'Sửa đổi tái khám'}
							</Button>
							<Button variant="outline" color="red" onClick={openDeleteModal}>
								Hủy tái khám
							</Button>
						</Group>
					)}
					<Stack justify={'space-between'} sx={{ flexDirection: 'row' }}>
						{editReExam ? (
							<DatePicker
								locale="vi"
								inputFormat="DD/MM/YYYY"
								placeholder="Chọn ngày dự kiến"
								label="Ngày dự kiến"
								icon={<IconCalendar />}
								withAsterisk={true}
								minDate={new Date()}
								{...form.getInputProps('reExamDate')}
								sx={{ minWidth: 200 }}
							/>
						) : (
							<TextInput
								variant="unstyled"
								label="Ngày dự kiến"
								defaultValue={dayjs(checkupData?.reExam?.date).format(
									'DD/MM/YYYY'
								)}
								readOnly={true}
							/>
						)}
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
							variant={!editReExam ? 'unstyled' : 'default'}
							readOnly={!editReExam}
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
							variant={!editReExam ? 'unstyled' : 'default'}
							readOnly={!editReExam}
						/>
					</Stack>
				</Stack>
				{editReExam && (
					<Stack align={'center'} my="sm">
						<Button
							type="submit"
							disabled={isLoadingOperationList || !form.isValid()}
						>
							{checkupData?.hasReExam && isReExamEditable
								? 'Cập nhật tái khám'
								: 'Xác nhận tái khám'}
						</Button>
					</Stack>
				)}
			</form>
		</Stack>
	)
}
export default Reschedule
