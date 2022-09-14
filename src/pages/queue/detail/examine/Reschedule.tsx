import { Button, Stack, Select, Textarea } from '@mantine/core'
import { DatePicker } from '@mantine/dates'
import { IconCalendar } from '@tabler/icons'
import 'dayjs/locale/vi'

const Reschedule = () => {
	return (
		<Stack mt="sm">
			<Stack
				sx={{ flexDirection: 'row' }}
				justify={'space-between'}
				align="baseline"
			>
				<Stack align="start" sx={{ width: '40%' }}>
					<DatePicker
						locale="vi"
						inputFormat="DD/MM/YYYY"
						placeholder="Chọn ngày dự kiến"
						label="Ngày dự kiến"
						icon={<IconCalendar />}
					/>

					<Textarea
						label="Ghi chú"
						placeholder="Viết ghi chú cho người bệnh"
						minRows={2}
						maxRows={4}
						sx={{ minWidth: '100%' }}
					/>
				</Stack>

				<Stack sx={{ width: '60%' }}>
					<Select
						mt="md"
						size="sm"
						multiple={true}
						label="Các xét nghiệm yêu cầu"
						placeholder="Pick one"
						data={[{ value: '10001', label: 'Phòng 101' }]}
						searchable
						nothingFound="Không tìm thấy dữ liệu"
					/>
				</Stack>
			</Stack>
			<Stack align={'center'} my="sm">
				<Button color="cyan">Xác nhận tái khám</Button>
			</Stack>
		</Stack>
	)
}
export default Reschedule
