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
				<RowWithLabel
					label="Tình trạng"
					content={data?.isReExam ? 'Tái khám' : 'Khám thường'}
				/>
				<RowWithLabel label="Khoa" content={data?.departmentName} isOdd />
				<RowWithLabel label="Bác sĩ" content={data?.doctorName} />
				<RowWithLabel
					label="Phòng"
					content={`Phòng khám ${data?.roomNumber ?? '--'} tầng ${
						data?.floor ?? '--'
					}`}
					isOdd
				/>
				<RowWithLabel label="Triệu chứng" content={data?.clinicalSymptom} />
				<RowWithLabel
					label="Chẩn đoán"
					content={data?.icdDiseases
						?.map((item) => item.icdDiseaseName)
						?.join(', ')}
					isOdd
				/>

				<Grid>
					<Grid.Col span={3}>
						<RowWithLabel
							labelSpan={7}
							label="Nhịp tim (BPM)"
							content={data?.pulse?.toString() ?? '---'}
						/>
					</Grid.Col>
					<Grid.Col span={3}>
						<RowWithLabel
							labelSpan={7}
							label="Huyết áp (mmHg)"
							content={data?.bloodPressure?.toString() ?? '---'}
						/>
					</Grid.Col>
					<Grid.Col span={3}>
						<RowWithLabel
							labelSpan={7}
							label="Nhiệt độ (°C)"
							content={data?.temperature?.toString() ?? '---'}
						/>
					</Grid.Col>
				</Grid>
				<RowWithLabel
					labelSpan={3}
					label="Biểu hiện lâm sàng"
					content={data?.diagnosis?.toString() ?? '---'}
					isOdd
				/>
				<RowWithLabel
					labelSpan={3}
					label="Lời khuyên bác sĩ"
					content={data?.doctorAdvice?.toString() ?? '---'}
				/>
			</Stack>
		</Stack>
	)
}
export default HistoryRecord
