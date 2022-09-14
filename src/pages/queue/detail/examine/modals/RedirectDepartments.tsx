import { Button, Select, Stack, Text } from '@mantine/core'
import { openConfirmModal, closeAllModals } from '@mantine/modals'

const RequestOperations = () => {
	return (
		<Button
			fullWidth={true}
			color="green"
			variant="outline"
			onClick={() =>
				openConfirmModal({
					size: 'xl',
					title: 'Yêu cầu xét nghiệm',
					closeOnClickOutside: false,
					closeOnConfirm: false,
					labels: { confirm: 'Tiếp tục', cancel: 'Hủy' },
					children: (
						<Stack>
							<Select
								mt="md"
								size="sm"
								multiple={true}
								label="Các xét nghiệm yêu cầu"
								placeholder="Chọn một"
								data={[{ value: '10001', label: 'Phòng 101' }]}
								searchable
								nothingFound="Không tìm thấy dữ liệu"
							/>
						</Stack>
					),
					onConfirm: () =>
						openConfirmModal({
							title: 'This is modal at second layer',
							labels: { confirm: 'Close modal', cancel: 'Back' },
							closeOnConfirm: false,
							children: (
								<Text size="sm">
									When this modal is closed modals state will revert to first
									modal
								</Text>
							),
							onConfirm: closeAllModals,
						}),
				})
			}
		>
			Yêu cầu xét nghiệm
		</Button>
	)
}
export default RequestOperations
