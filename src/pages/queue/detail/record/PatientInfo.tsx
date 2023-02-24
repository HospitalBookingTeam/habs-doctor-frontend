import RowWithLabel from '@/components/Row'
import { Patient } from '@/entities/record'
import { formatDate } from '@/utils/formats'
import { Stack, Title } from '@mantine/core'

const PatientInfo = ({
	data,
	gap = 12,
	showTitle = true,
}: {
	data?: Patient
	gap?: number
	showTitle?: boolean
}) => {
	return (
		<Stack>
			{showTitle && (
				<Title order={3} px="0" size="h4">
					Thông tin người bệnh
				</Title>
			)}
			<Stack sx={{ gap }}>
				<RowWithLabel label={'Họ và tên'} content={data?.name} />
				<RowWithLabel
					label={'Ngày sinh'}
					content={data?.dateOfBirth ? formatDate(data.dateOfBirth) : '---'}
				/>
				<RowWithLabel label={'SĐT'} content={data?.phoneNumber} />
				<RowWithLabel
					label={'Giới tính'}
					content={data?.gender === 0 ? 'Nam' : 'Nữ'}
				/>
				<RowWithLabel label={'BHYT'} content={data?.bhyt} />
			</Stack>
		</Stack>
	)
}

export default PatientInfo
