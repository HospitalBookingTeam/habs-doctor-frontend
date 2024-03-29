import { useGetCheckupRecordByIdQuery } from '@/store/record/api'
import { useRequestOperationsByIdMutation } from '@/store/record/api'
import {
	Stack,
	Text,
	Modal,
	Group,
	Paper,
	LoadingOverlay,
	Divider,
} from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { useNavigate, useParams } from 'react-router-dom'
import { useState, lazy } from 'react'
import { useForm } from '@mantine/form'
import {
	RequestOperationsForm,
	RequestOperationsResponse,
} from '@/entities/operation'
import OperationList from './OperationList'
import PrintOperationDetail from './modals/PrintOperationDetail'
import { openModal } from '@mantine/modals'
import { useAppDispatch } from '@/store/hooks'
import { toggleResetCheckup } from '@/store/record/slice'

const TestRecordList = lazy(() => import('@/components/Record/TestRecordList'))

type RequestOperationsProps = {
	updateProgress: () => void
}
const RequestOperations = ({ updateProgress }: RequestOperationsProps) => {
	const navigate = useNavigate()
	const { id: queueId } = useParams()
	const { data: checkupData, isSuccess: isCheckupDataSuccess } =
		useGetCheckupRecordByIdQuery(Number(queueId), {
			skip: !queueId,
		})
	const dispatch = useAppDispatch()
	const [responseData, setResponseData] = useState<RequestOperationsResponse>()
	const [showResponse, setShowResponse] = useState(false)

	const [requestOperationsMutation, { isLoading: isLoadingRequestOperations }] =
		useRequestOperationsByIdMutation()

	const form = useForm<RequestOperationsForm>({
		initialValues: {
			examOperationIds: [],
		},
	})

	const onSubmit = async (values: RequestOperationsForm) => {
		if (!checkupData) {
			showNotification({
				title: 'Thông tin người bệnh không tồn tại',
				message: <Text>Vui lòng kiểm tra lại thông tin khám bệnh.</Text>,
				color: 'red',
			})
			return
		}
		if (!values?.examOperationIds?.length) {
			updateProgress()
			return
		}
		await requestOperationsMutation({
			id: checkupData.id,
			...values,
		})
			.unwrap()
			.then((payload) => {
				setResponseData(payload)
				showNotification({
					title: 'Yêu cầu xét nghiệm thành công',
					message: <Text></Text>,
				})
				// updateProgress()
				setShowResponse(true)
				form.reset()
			})
	}

	return (
		<>
			<form onSubmit={form.onSubmit(onSubmit)} id="form">
				<Stack mt="md">
					{!!checkupData?.testRecords?.length && (
						<>
							<Text weight={'bolder'}>Kết quả xét nghiệm</Text>
							<TestRecordList
								showTitle={false}
								data={checkupData?.testRecords}
								showSpoiler={true}
							/>
							<Divider />
						</>
					)}

					<Text>Vui lòng chọn các xét nghiệm dưới đây</Text>
					<Stack>
						<LoadingOverlay visible={isLoadingRequestOperations} />
						<OperationList
							updateSelectedOperationIds={(ids) =>
								form.setValues({
									examOperationIds: ids,
								})
							}
						/>
					</Stack>
				</Stack>
			</form>

			<Modal
				opened={showResponse}
				onClose={() => {
					if (!responseData) {
						navigate('/', { replace: true })
						return
					}
					setShowResponse(false)
					if (responseData?.success) {
						showNotification({
							title: 'Hoàn thành xét nghiệm',
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
				title={'Thông tin xét nghiệm'}
				closeOnClickOutside={true}
				centered={true}
				size={'720px'}
				withCloseButton={!isLoadingRequestOperations}
			>
				<Group align="center" position="center" mx="auto" sx={{ width: 200 }}>
					<PrintOperationDetail data={responseData?.incomingTests} />
				</Group>
				<Group position="center" grow={true} mt="md">
					{responseData?.incomingTests?.map((item) => (
						<Paper
							withBorder
							key={item.operationId}
							shadow="md"
							p="md"
							sx={{ maxWidth: 350 }}
						>
							<Stack>
								<Text weight={700}>{item.operationName}</Text>
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
			</Modal>
			{/* <Button
				fullWidth={true}
				color="green"
				variant="outline"
				onClick={() => {
					setOpened(true)
					form.reset()
				}}
			>
				Yêu cầu xét nghiệm
			</Button> */}
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
export default RequestOperations
