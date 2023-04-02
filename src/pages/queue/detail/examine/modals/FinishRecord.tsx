import { useGetCheckupRecordByIdQuery } from '@/store/record/api'
import { useUpdateStatusRecordMutation } from '@/store/record/api'
import { CheckupRecordStatus } from '@/utils/renderEnums'
import { Button, Stack, Text, Modal } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { useNavigate, useParams } from 'react-router-dom'
import { useState } from 'react'
import { handleNextPatientDirect } from '../helpers'
import { useAppDispatch } from '@/store/hooks'
import { openModal } from '@mantine/modals'
import { toggleResetCheckup } from '@/store/record/slice'

const FinishRecord = () => {
	const { id: queueId } = useParams()
	const { data: checkupData, isSuccess: isCheckupDataSuccess } =
		useGetCheckupRecordByIdQuery(Number(queueId), {
			skip: !queueId,
		})
	const [updateStatusRecord, { isLoading: isLoadingUpdateStatus }] =
		useUpdateStatusRecordMutation()
	const [opened, setOpened] = useState(false)
	const dispatch = useAppDispatch()
	const navigate = useNavigate()

	const onConfirm = async () => {
		if (!checkupData) {
			showNotification({
				title: 'Thông tin người bệnh không tồn tại',
				message: <Text>Vui lòng kiểm tra lại thông tin khám bệnh.</Text>,
				color: 'red',
			})
			return
		}
		await updateStatusRecord({
			id: checkupData.id,
			patientId: checkupData.patientId,
			status: CheckupRecordStatus.KET_THUC,
		})
			.unwrap()
			.then((resp) => {
				if (resp?.success) {
					showNotification({
						title: 'Hoàn thành khám bệnh',
						message: <Text>Quy trình khám bệnh kết thúc thành công</Text>,
					})
					if (resp?.nextCheckupRecordId) {
						navigate(`/${resp?.nextCheckupRecordId}`, { replace: true })
						openModal({
							title: 'Người bệnh tiếp theo',
							children: (
								<Stack align="center">
									<Text>{resp?.nextPatientName}</Text>
								</Stack>
							),
							centered: true,
						})
						dispatch(toggleResetCheckup(true))
					} else {
						navigate('/', { replace: true })
					}
					setOpened(false)
				} else {
					showNotification({
						title: 'Đã xảy ra lỗi',
						message: <Text>Vui lòng liên hệ admin để được hỗ trợ</Text>,
						color: 'red',
					})
				}
			})
	}

	return (
		<>
			<Modal
				opened={opened}
				onClose={() => setOpened(false)}
				title="Hoàn thành khám bệnh"
				closeOnClickOutside={false}
				centered={true}
				withCloseButton={!isLoadingUpdateStatus}
			>
				<Stack>
					<Text>Vui lòng xác nhận nếu người bệnh đã được khám xong.</Text>

					<Stack mt="md" sx={{ flexDirection: 'row' }} justify="end">
						<Button
							variant="default"
							color="dark"
							onClick={() => setOpened(false)}
							disabled={isLoadingUpdateStatus}
						>
							Quay lại
						</Button>
						<Button onClick={onConfirm} loading={isLoadingUpdateStatus}>
							Xác nhận
						</Button>
					</Stack>
				</Stack>
			</Modal>
			<Button
				fullWidth={true}
				color="green"
				onClick={() => setOpened(true)}
				// onClick={() =>
				// 	openConfirmModal({
				// 		size: 'lg',
				// 		title: 'Hoàn thành khám bệnh',
				// 		closeOnClickOutside: false,
				// 		closeOnConfirm: false,
				// 		centered: true,
				// 		labels: { confirm: 'Tiếp tục', cancel: 'Hủy' },
				// 		children: (
				// 			<Stack>
				// 				<Text>Vui lòng tiếp tục nếu người bệnh đã được khám xong.</Text>
				// 			</Stack>
				// 		),

				// 		onConfirm,
				// 	})
				// }
			>
				Hoàn thành khám bệnh
			</Button>
		</>
	)
}
export default FinishRecord
