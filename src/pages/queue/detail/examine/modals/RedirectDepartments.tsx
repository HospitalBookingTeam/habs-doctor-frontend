import {
	DepartmentRequest,
	DepartmentRequestDetail,
	IRedirectDepartmentResponse,
} from '@/entities/department'
import { useAppDispatch } from '@/store/hooks'
import { useGetCheckupRecordByIdQuery } from '@/store/record/api'
import {
	useGetDepartmentListQuery,
	useRequestRedirectDepartmentsByIdMutation,
} from '@/store/record/api'
import { toggleResetCheckup } from '@/store/record/slice'
import {
	Button,
	Grid,
	Stack,
	Text,
	Modal,
	Textarea,
	Select,
	ScrollArea,
	Divider,
	Paper,
	Group,
	ActionIcon,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { randomId } from '@mantine/hooks'
import { openModal } from '@mantine/modals'
import { showNotification } from '@mantine/notifications'
import { IconPlus, IconTrash } from '@tabler/icons'
import { useState, Fragment } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const DEFAULT_DEPARTMENT: DepartmentRequestDetail = {
	departmentId: 0,
	clinicalSymptom: '',
}

const RequestDepartments = () => {
	const [opened, setOpened] = useState(false)
	const navigate = useNavigate()
	const [responseData, setResponseData] =
		useState<IRedirectDepartmentResponse>()
	const [showResponse, setShowResponse] = useState(false)
	const dispatch = useAppDispatch()

	const { data: departmentList, isLoading: isLoadingDepartmentList } =
		useGetDepartmentListQuery()
	const { id: queueId } = useParams()
	const { data: checkupData, isSuccess: isCheckupDataSuccess } =
		useGetCheckupRecordByIdQuery(Number(queueId), {
			skip: !queueId,
		})

	const [
		requestRedirectDepartmentsMutation,
		{ isLoading: isLoadingRedirectDepartments },
	] = useRequestRedirectDepartmentsByIdMutation()

	const form = useForm<Omit<DepartmentRequest, 'id'>>({
		initialValues: {
			details: [DEFAULT_DEPARTMENT],
		},
	})

	const rows = form.values.details?.map((item, index) => (
		<Fragment key={item?.departmentId?.toString() ?? randomId()}>
			<Grid.Col span={4}>
				<Select
					label="Tên khoa"
					placeholder="Chọn tên khoa phù hợp"
					data={
						departmentList
							?.filter(
								(_item) =>
									!form.values.details?.some(
										(existingDepartment) =>
											existingDepartment.departmentId === _item.id &&
											existingDepartment.departmentId !== item.departmentId
									)
							)
							.map((_item) => ({
								value: _item.id,
								label: _item.name,
							})) ?? []
					}
					searchable
					nothingFound="Không tìm thấy khoa phù hợp"
					{...form.getInputProps(`details.${index}.departmentId`)}
				/>
			</Grid.Col>
			<Grid.Col span={7}>
				<Textarea
					label="Nội dung chuyển khoa"
					placeholder="Vd. Không uống nước có ga sau khi uống thuốc"
					autosize
					minRows={2}
					maxRows={4}
					{...form.getInputProps(`details.${index}.clinicalSymptom`)}
				/>
			</Grid.Col>
			<Grid.Col span={1} sx={{ textAlign: 'center' }}>
				<ActionIcon
					color="red"
					size="sm"
					mr="sm"
					onClick={() => form.removeListItem('details', index)}
				>
					<IconTrash />
				</ActionIcon>
			</Grid.Col>
			<Grid.Col span={12}>
				<Divider />
			</Grid.Col>
		</Fragment>
	))
	const onSubmit = async (values: Omit<DepartmentRequest, 'id'>) => {
		if (!checkupData) {
			showNotification({
				title: 'Thông tin người bệnh không tồn tại',
				message: <Text>Vui lòng kiểm tra lại thông tin khám bệnh.</Text>,
				color: 'red',
			})
			return
		}
		await requestRedirectDepartmentsMutation({
			id: checkupData.id,
			...values,
		})
			.unwrap()
			.then((payload) => {
				setResponseData(payload)
				showNotification({
					title: 'Yêu cầu chuyển khoa thành công',
					message: <Text></Text>,
				})
				setShowResponse(true)
				form.reset()
			})
	}

	return (
		<>
			<Modal
				opened={opened}
				onClose={() => {
					setOpened(false)
					if (!responseData) {
						navigate('/', { replace: true })
						return
					}
					setShowResponse(false)
					if (responseData?.success) {
						showNotification({
							title: 'Chuyển khoa thành công',
							message: <Text></Text>,
						})
						if (responseData?.nextCheckupRecordId) {
							navigate(`/${responseData?.nextCheckupRecordId}`, {
								replace: true,
							})
							openModal({
								title: 'Người bệnh tiếp theo',
								children: (
									<Stack align="center">
										<Text>{responseData?.nextPatientName}</Text>
									</Stack>
								),
								centered: true,
							})
							dispatch(toggleResetCheckup(true))
						} else {
							navigate('/', { replace: true })
						}
					} else {
						showNotification({
							title: 'Đã xảy ra lỗi',
							message: <Text>Vui lòng liên hệ admin để được hỗ trợ</Text>,
							color: 'red',
						})
					}
				}}
				title={showResponse ? 'Thông tin chuyển khoa' : 'Yêu cầu chuyển khoa'}
				closeOnClickOutside={!showResponse}
				size={showResponse ? '720px' : '70%'}
				centered={true}
				// withCloseButton={!isLoadingUpdateStatus}
			>
				<Group
					position="center"
					grow={true}
					sx={{ display: showResponse ? 'flex' : 'none' }}
				>
					{responseData?.redirect?.map((item) => (
						<Paper
							withBorder
							key={item.roomId}
							shadow="md"
							p="md"
							sx={{ maxWidth: 350 }}
						>
							<Stack>
								<Text weight={700}>{item.departmentName}</Text>
								{/* <ResponseRow
									label="Số khám bệnh"
									content={item.numericalOrder?.toString() ?? '---'}
								/> */}
								<ResponseRow
									label="Nơi khám"
									content={`Phòng ${item.roomNumber} - Tầng ${item.floor}`}
								/>
							</Stack>
						</Paper>
					))}
				</Group>

				<form
					onSubmit={form.onSubmit(onSubmit)}
					style={{ display: showResponse ? 'none' : 'block' }}
				>
					<Stack>
						<Text>Vui lòng chọn các chuyên khoa cho người bệnh.</Text>
						<ScrollArea sx={{ height: 300 }}>
							<Grid sx={{ width: '100%' }}>{rows}</Grid>
						</ScrollArea>

						<Stack align={'center'} my="sm" sx={{ width: '100%' }}>
							<Button
								size="md"
								disabled={isLoadingDepartmentList}
								fullWidth
								color="cyan"
								sx={{ maxWidth: 250 }}
								variant="outline"
								leftIcon={<IconPlus />}
								type="button"
								onClick={() =>
									form.insertListItem('details', DEFAULT_DEPARTMENT)
								}
							>
								Thêm khoa
							</Button>
						</Stack>

						<Stack mt="md" sx={{ flexDirection: 'row' }} justify="end">
							<Button
								variant="default"
								color="dark"
								onClick={() => setOpened(false)}
								disabled={isLoadingRedirectDepartments}
							>
								Quay lại
							</Button>
							<Button type="submit" loading={isLoadingRedirectDepartments}>
								Tiếp tục
							</Button>
						</Stack>
					</Stack>
				</form>
			</Modal>
			<Button
				fullWidth={true}
				color="green"
				variant="outline"
				onClick={() => setOpened(true)}
			>
				Chuyển khoa
			</Button>
		</>
	)
}

const ResponseRow = ({
	label,
	content,
}: {
	label: string
	content: string
}) => (
	<Stack sx={{ flexDirection: 'row' }}>
		<Text color="dimmed" sx={{ width: 120 }}>
			{label}
		</Text>
		<Text>{content}</Text>
	</Stack>
)

export default RequestDepartments
