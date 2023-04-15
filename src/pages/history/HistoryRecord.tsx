import RowWithLabel from '@/components/Row'
import { CheckupRecord } from '@/entities/record'
import { Stack, Title, Grid } from '@mantine/core'

const HistoryRecord = ({ data }: { data?: CheckupRecord }) => {
	return (
		<Stack>
			<Title order={3} size="h4">
				Thông tin khám bệnh
			</Title>

			<Stack>
				<RowWithLabel label="Mã số" content={data?.code ?? '---'} />
				<RowWithLabel
					label="Tình trạng"
					content={data?.isReExam ? 'Tái khám' : 'Khám thường'}
					isOdd
				/>
				<RowWithLabel label="Khoa" content={data?.departmentName} />
				<RowWithLabel label="Bác sĩ" content={data?.doctorName} isOdd />
				<RowWithLabel
					label="Phòng"
					content={`Phòng khám ${data?.roomNumber ?? '--'} tầng ${
						data?.floor ?? '--'
					}`}
				/>
				<RowWithLabel
					label="Triệu chứng"
					content={data?.clinicalSymptom}
					isOdd
				/>
				<RowWithLabel
					label="Chẩn đoán"
					content={data?.icdDiseases
						?.map((item) => item.icdDiseaseName)
						?.join(', ')}
				/>

				<Grid>
					<Grid.Col span={3}>
						<RowWithLabel
							labelSpan={7}
							label="Chiều cao (cm)"
							content={data?.bloodPressure?.toString() ?? '---'}
							isOdd
						/>
					</Grid.Col>
					<Grid.Col span={3}>
						<RowWithLabel
							labelSpan={7}
							label="Cân nặng (kg)"
							content={data?.pulse?.toString() ?? '---'}
							isOdd
						/>
					</Grid.Col>
					<Grid.Col span={3}>
						<RowWithLabel
							labelSpan={7}
							label="Nhiệt độ (°C)"
							content={data?.temperature?.toString() ?? '---'}
							isOdd
						/>
					</Grid.Col>
				</Grid>
				<RowWithLabel
					labelSpan={3}
					label="Biểu hiện lâm sàng"
					content={data?.diagnosis?.toString() ?? '---'}
				/>
				<RowWithLabel
					labelSpan={3}
					label="Lời khuyên bác sĩ"
					content={data?.doctorAdvice?.toString() ?? '---'}
					isOdd
				/>
			</Stack>
		</Stack>
	)
}
export default HistoryRecord
