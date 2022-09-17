import { Patient } from '@/entities/record'
import { formatDate } from '@/utils/formats'
import { Paper, Stack, Title, Text, createStyles } from '@mantine/core'

const useStyles = createStyles((theme) => ({
	label: {
		color: theme.colors.gray[6],
		width: '20%',
	},
}))

const PatientInfo = ({ data }: { data?: Patient }) => {
	return (
		<Stack>
			<Title order={3} size="h6">
				Thông tin người bệnh
			</Title>

			<Paper shadow="sm" p="md">
				<Stack>
					<PatientRow label={'Họ và tên'} content={data?.name} />
					<PatientRow
						label={'Ngày sinh'}
						content={data?.dateOfBirth ? formatDate(data.dateOfBirth) : '---'}
					/>
					<PatientRow label={'SĐT'} content={data?.phoneNumber} />
					<PatientRow
						label={'Giới tính'}
						content={data?.gender === 0 ? 'Nam' : 'Nữ'}
					/>
					<PatientRow label={'BHYT'} content={data?.bhyt} />
				</Stack>
			</Paper>
		</Stack>
	)
}

const PatientRow = ({
	label,
	content,
}: {
	label: string
	content?: string
}) => {
	const { classes } = useStyles()
	return (
		<Stack sx={{ flexDirection: 'row' }}>
			<Text className={classes.label}>{label}</Text>
			<Text>{content}</Text>
		</Stack>
	)
}

export default PatientInfo
