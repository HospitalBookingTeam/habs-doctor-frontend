import { INextPatientResponse } from '@/entities/base'
import { showNotification } from '@mantine/notifications'
import { useNavigate } from 'react-router-dom'
import { Text, Stack } from '@mantine/core'
import { openModal } from '@mantine/modals'
import { useAppDispatch } from '@/store/hooks'
import { toggleResetCheckup } from '@/store/record/slice'

type IHandleNextPatientDirectProps = {
	resp: INextPatientResponse
	closeModal?: () => void
	successTitle: string
	successDescription: string
}
export const handleNextPatientDirect = ({
	resp,
	closeModal,
	successTitle,
	successDescription,
}: IHandleNextPatientDirectProps) => {
	const navigate = useNavigate()
	const dispatch = useAppDispatch()
	if (resp?.success) {
		showNotification({
			title: successTitle,
			message: <Text>{successDescription}</Text>,
		})
		if (resp?.nextCheckupRecordId) {
			navigate(`/${resp?.nextCheckupRecordId}`, { replace: true })
			openModal({
				children: (
					<Stack align="center">
						<Text>Người bệnh tiếp theo</Text>
						<Text weight={'bolder'}>{resp?.nextPatientName}</Text>
					</Stack>
				),
			})
			dispatch(toggleResetCheckup(true))
		} else {
			navigate('/', { replace: true })
		}
		closeModal?.()
	} else {
		showNotification({
			title: 'Đã xảy ra lỗi',
			message: <Text>Vui lòng liên hệ admin để được hỗ trợ</Text>,
			color: 'red',
		})
	}
}
