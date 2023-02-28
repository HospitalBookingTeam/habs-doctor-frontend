import { useGetCheckupRecordByIdQuery } from '@/store/record/api'
import {
	useGetOperationListQuery,
	useRequestOperationsByIdMutation,
} from '@/store/record/api'
import {
	Button,
	Stack,
	Text,
	Modal,
	MultiSelect,
	Group,
	Paper,
} from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { useNavigate, useParams } from 'react-router-dom'
import { useState } from 'react'
import OperationsTable from '@/components/Table/OperationsTable'
import { useForm } from '@mantine/form'
import {
	RequestOperationsForm,
	RequestOperationsResponse,
} from '@/entities/operation'
import OperationList from '../OperationList'

const RequestOperationsButton = () => {
	const navigate = useNavigate()
	const { id: queueId } = useParams()
	const { data: checkupData, isSuccess: isCheckupDataSuccess } =
		useGetCheckupRecordByIdQuery(Number(queueId), {
			skip: !queueId,
		})

	const [responseData, setResponseData] = useState<RequestOperationsResponse[]>(
		[]
	)

	const [requestOperationsMutation, { isLoading: isLoadingRequestOperations }] =
		useRequestOperationsByIdMutation()
	const { data: operationList, isLoading: isLoadingOperationList } =
		useGetOperationListQuery()

	const form = useForm<RequestOperationsForm>({
		initialValues: {
			examOperationIds: [],
		},
	})

	const [opened, setOpened] = useState(false)

	const onSubmit = async (values: RequestOperationsForm) => {
		if (!checkupData) {
			showNotification({
				title: 'Thông tin người bệnh không tồn tại',
				message: <Text>Vui lòng kiểm tra lại thông tin khám bệnh.</Text>,
				color: 'red',
			})
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
				// navigate('/')
			})
	}

	const showResponse = !!responseData?.length

	return (
		<>
			<Modal
				opened={opened}
				onClose={() => {
					setOpened(false)
					if (showResponse) {
						navigate('/')
					}
				}}
				title={showResponse ? 'Thông tin xét nghiệm' : 'Yêu cầu xét nghiệm'}
				closeOnClickOutside={showResponse}
				centered={true}
				size={showResponse ? '720px' : '70%'}
				withCloseButton={!isLoadingRequestOperations}
			>
				<Group
					position="center"
					grow={true}
					sx={{ display: showResponse ? 'flex' : 'none' }}
				>
					{responseData?.map((item) => (
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
				<form
					onSubmit={form.onSubmit(onSubmit)}
					style={{ display: showResponse ? 'none' : 'block' }}
				>
					<Stack>
						<Text>Vui lòng chọn các xét nghiệm dưới đây</Text>

						<Stack>
							<OperationList
								updateSelectedOperationIds={(ids) =>
									form.setValues({
										examOperationIds: ids,
									})
								}
							/>
						</Stack>
						<Stack mt="md" sx={{ flexDirection: 'row' }} justify="end">
							<Button
								variant="default"
								color="dark"
								onClick={() => setOpened(false)}
								disabled={isLoadingRequestOperations}
							>
								Quay lại
							</Button>
							<Button type="submit" loading={isLoadingRequestOperations}>
								Xác nhận
							</Button>
						</Stack>
					</Stack>
				</form>
			</Modal>
			<Button
				fullWidth={true}
				color="green"
				variant="outline"
				onClick={() => {
					setOpened(true)
					form.reset()
				}}
			>
				Yêu cầu xét nghiệm
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
export default RequestOperationsButton
