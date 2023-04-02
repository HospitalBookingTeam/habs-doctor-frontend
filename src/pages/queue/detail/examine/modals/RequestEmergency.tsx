import { useGetCheckupRecordByIdQuery } from '@/store/record/api'
import { useUpdateStatusRecordMutation } from '@/store/record/api'
import { CheckupRecordStatus } from '@/utils/renderEnums'
import { Button, Stack, Text, Modal } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { useNavigate, useParams } from 'react-router-dom'
import { useState } from 'react'
import { useAppDispatch } from '@/store/hooks'
import { openModal } from '@mantine/modals'
import { toggleResetCheckup } from '@/store/record/slice'

const RequestEmergency = () => {
	const navigate = useNavigate()
	const { id: queueId } = useParams()
	const { data: checkupData, isSuccess: isCheckupDataSuccess } =
		useGetCheckupRecordByIdQuery(Number(queueId), {
			skip: !queueId,
		})
	const dispatch = useAppDispatch()

	const [updateStatusRecord, { isLoading: isLoadingUpdateStatus }] =
		useUpdateStatusRecordMutation()
	const [opened, setOpened] = useState(false)

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
			status: CheckupRecordStatus.NHAP_VIEN,
		})
			.unwrap()
			.then((resp) => {
				setOpened(false)
				if (resp?.success) {
					showNotification({
						title: 'Nhập viện thành công',
						message: <Text>{checkupData.patientName} đã nhập viện.</Text>,
						color: 'orange',
					})
					if (resp?.nextCheckupRecordId) {
						navigate(`/${resp?.nextCheckupRecordId}`, {
							replace: true,
						})
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
				title="Xác nhận nhập viện"
				closeOnClickOutside={false}
				centered={true}
				withCloseButton={!isLoadingUpdateStatus}
			>
				<Stack>
					<Text>Vui lòng tiếp tục nếu người bệnh cần được nhập viện.</Text>

					<Stack mt="md" sx={{ flexDirection: 'row' }} justify="end">
						<Button
							variant="default"
							color="dark"
							onClick={() => setOpened(false)}
							disabled={isLoadingUpdateStatus}
						>
							Quay lại
						</Button>
						<Button
							onClick={onConfirm}
							color="orange"
							loading={isLoadingUpdateStatus}
						>
							Tiếp tục
						</Button>
					</Stack>
				</Stack>
			</Modal>
			<Button
				fullWidth={true}
				color="green"
				variant="outline"
				onClick={() => setOpened(true)}
			>
				Nhập viện
			</Button>
		</>
	)
}
export default RequestEmergency
