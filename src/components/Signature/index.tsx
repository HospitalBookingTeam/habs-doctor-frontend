import { formatDate } from '@/utils/formats'
import { Paper, Stack, Text } from '@mantine/core'

const Signature = ({ date }: { date?: string | number }) => {
	return (
		<Paper withBorder p="sm" radius={0} color="green">
			<Stack>
				<Text color="red" size="xs">
					Signature Valid
				</Text>
				<Text color="red" size="xs">
					Ký bởi: BỆNH VIỆN NHI ĐỒNG 2
				</Text>
				<Text color="red" size="xs">
					Ký ngày: {formatDate(date ?? new Date().toString(), 'DD-MM-YYYY')}
				</Text>
			</Stack>
		</Paper>
	)
}
export default Signature
